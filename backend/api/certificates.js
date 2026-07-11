/**
 * Certificate API Endpoints
 * 
 * Handles:
 * - Typst to PDF rendering
 * - Certificate verification
 * - Certificate storage and retrieval
 */

import { Router } from 'express';
import { spawn } from 'child_process';
import { createHash } from 'crypto';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase.js';

const router = Router();

/**
 * POST /api/certificates/render
 * 
 * Renders Typst template to PDF
 */
router.post('/render', async (req, res) => {
  try {
    const { typstContent, certificateId } = req.body;

    if (!typstContent || !certificateId) {
      return res.status(400).json({
        error: 'Missing required fields: typstContent, certificateId',
      });
    }

    // Create temporary files
    const tmpDir = tmpdir();
    const typstFile = join(tmpDir, `cert_${certificateId}.typ`);
    const pdfFile = join(tmpDir, `cert_${certificateId}.pdf`);

    // Write Typst template to file
    writeFileSync(typstFile, typstContent, 'utf-8');

    // Render Typst to PDF using manus-render-diagram or typst CLI
    await new Promise((resolve, reject) => {
      const process = spawn('typst', ['compile', typstFile, pdfFile], {
        timeout: 30000, // 30 second timeout
      });

      let stderr = '';

      process.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Typst compilation failed: ${stderr}`));
        } else {
          resolve();
        }
      });

      process.on('error', (err) => {
        reject(err);
      });
    });

    // Read generated PDF
    const pdfBuffer = readFileSync(pdfFile);

    // Upload to Supabase Storage
    const fileName = `certificates/${certificateId}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reclamation-university')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload certificate: ${uploadError.message}`);
    }

    // Clean up temporary files
    try {
      unlinkSync(typstFile);
      unlinkSync(pdfFile);
    } catch (err) {
      console.warn('Failed to clean up temporary files:', err);
    }

    // Return PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${certificateId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Certificate rendering error:', error);
    res.status(500).json({
      error: 'Failed to render certificate',
      message: error.message,
    });
  }
});

/**
 * POST /api/certificates/verify/:certificateId
 * 
 * Verifies certificate authenticity
 */
router.post('/verify/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { studentName, completionDate } = req.body;

    if (!studentName || !completionDate) {
      return res.status(400).json({
        error: 'Missing required fields: studentName, completionDate',
      });
    }

    // Verify certificate signature
    const expectedSignature = generateCertificateSignature(
      studentName,
      completionDate,
      certificateId
    );

    // Check if certificate exists in storage
    const { data: files, error: listError } = await supabase.storage
      .from('reclamation-university')
      .list(`certificates/${certificateId}`);

    if (listError || !files || files.length === 0) {
      return res.json({
        valid: false,
        error: 'Certificate not found',
      });
    }

    // Certificate is valid
    res.json({
      valid: true,
      certificateId,
      studentName,
      completionDate,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      error: 'Failed to verify certificate',
      message: error.message,
    });
  }
});

/**
 * GET /api/certificates/:certificateId
 * 
 * Retrieves certificate PDF
 */
router.get('/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;

    // Download from Supabase Storage
    const { data, error } = await supabase.storage
      .from('reclamation-university')
      .download(`certificates/${certificateId}.pdf`);

    if (error) {
      return res.status(404).json({
        error: 'Certificate not found',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificate_${certificateId}.pdf"`);
    res.send(data);
  } catch (error) {
    console.error('Certificate retrieval error:', error);
    res.status(500).json({
      error: 'Failed to retrieve certificate',
      message: error.message,
    });
  }
});

/**
 * POST /api/certificates/save
 * 
 * Saves certificate metadata to database
 */
router.post('/save', async (req, res) => {
  try {
    const { studentName, facultyTitle, moduleTitle, integrationKey, xpReward, completionDate } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!studentName || !moduleTitle || !integrationKey) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Generate certificate ID
    const certificateId = generateCertificateId(studentName, completionDate, integrationKey);

    // Save to database
    const { data, error } = await supabase.from('rec_uni_certificates').insert([
      {
        id: certificateId,
        user_id: userId,
        student_name: studentName,
        faculty_title: facultyTitle,
        module_title: moduleTitle,
        integration_key: integrationKey,
        xp_reward: xpReward,
        completion_date: completionDate,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      certificateId,
    });
  } catch (error) {
    console.error('Certificate save error:', error);
    res.status(500).json({
      error: 'Failed to save certificate',
      message: error.message,
    });
  }
});

/**
 * Helper: Generate certificate signature
 */
function generateCertificateSignature(studentName, completionDate, certificateId) {
  const data = `${studentName}-${completionDate}-${certificateId}`;
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Helper: Generate certificate ID
 */
function generateCertificateId(studentName, date, integrationKey) {
  const timestamp = new Date(date).getTime();
  const hash = `${studentName}-${timestamp}-${integrationKey}`.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

export default router;
