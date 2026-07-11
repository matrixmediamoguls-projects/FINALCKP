import { useState } from 'react';
import { Download, Share2, Eye } from 'lucide-react';
import {
  generateBloomCertificate,
  downloadCertificate,
  shareCertificate,
} from '../../services/certificates/bloomCertificateGenerator';
import './BloomCertificateCard.css';

/**
 * BloomCertificateCard
 * 
 * Displays a student's Bloom Certificate with options to:
 * - Preview the certificate
 * - Download as PDF
 * - Share on social media or via link
 */
export default function BloomCertificateCard({
  studentName,
  facultyTitle,
  moduleTitle,
  integrationKey,
  xpReward,
  completionDate,
  onCertificateGenerated,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [certificateBlob, setCertificateBlob] = useState(null);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const handleGenerateCertificate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generateBloomCertificate({
        studentName,
        facultyTitle,
        moduleTitle,
        integrationKey,
        xpReward,
        completionDate,
      });

      setCertificateBlob(blob);

      if (onCertificateGenerated) {
        onCertificateGenerated(blob);
      }
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError(err.message || 'Failed to generate certificate');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (certificateBlob) {
      downloadCertificate(certificateBlob, studentName, moduleTitle);
    }
  };

  const handleShare = async () => {
    try {
      const shareData = await shareCertificate(
        integrationKey.slice(0, 8),
        studentName,
        moduleTitle
      );

      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Certificate link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing certificate:', err);
    }
  };

  const handlePreview = () => {
    if (certificateBlob) {
      const url = URL.createObjectURL(certificateBlob);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bloom-certificate-card">
      <div className="certificate-header">
        <div className="certificate-icon">✦</div>
        <div className="certificate-info">
          <h3>Bloom Certificate</h3>
          <p className="certificate-subtitle">
            {moduleTitle} • {facultyTitle}
          </p>
        </div>
      </div>

      <div className="certificate-details">
        <div className="detail-row">
          <span className="detail-label">Student</span>
          <span className="detail-value">{studentName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Module</span>
          <span className="detail-value">{moduleTitle}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Faculty</span>
          <span className="detail-value">{facultyTitle}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Experience Points</span>
          <span className="detail-value xp-badge">{xpReward} XP</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Completed</span>
          <span className="detail-value">
            {new Date(completionDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {error && <div className="certificate-error">{error}</div>}

      <div className="certificate-actions">
        {!certificateBlob ? (
          <button
            className="certificate-button primary"
            onClick={handleGenerateCertificate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Certificate'}
          </button>
        ) : (
          <>
            <button
              className="certificate-button secondary"
              onClick={handlePreview}
              title="Preview certificate"
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              className="certificate-button primary"
              onClick={handleDownload}
              title="Download certificate as PDF"
            >
              <Download size={16} />
              Download
            </button>
            <button
              className="certificate-button secondary"
              onClick={handleShare}
              title="Share certificate"
            >
              <Share2 size={16} />
              Share
            </button>
          </>
        )}
      </div>

      <div className="certificate-footer">
        <p className="certificate-note">
          Your Bloom Certificate verifies completion of {moduleTitle} and is secured with
          your unique integration key.
        </p>
      </div>
    </div>
  );
}
