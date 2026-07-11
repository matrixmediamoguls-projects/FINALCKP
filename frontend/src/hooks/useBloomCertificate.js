import { useState, useCallback } from 'react';
import { generateBloomCertificate } from '../services/certificates/bloomCertificateGenerator';

/**
 * useBloomCertificate
 * 
 * Hook for managing Bloom Certificate generation and state.
 * Handles certificate generation, caching, and error handling.
 */
export function useBloomCertificate() {
  const [certificates, setCertificates] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateCertificate = useCallback(
    async ({
      studentName,
      facultyTitle,
      moduleTitle,
      integrationKey,
      xpReward,
      completionDate,
    }) => {
      const cacheKey = `${studentName}-${integrationKey}`;

      // Return cached certificate if available
      if (certificates[cacheKey]) {
        return certificates[cacheKey];
      }

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

        // Cache the generated certificate
        setCertificates((prev) => ({
          ...prev,
          [cacheKey]: blob,
        }));

        return blob;
      } catch (err) {
        const errorMessage = err.message || 'Failed to generate certificate';
        setError(errorMessage);
        console.error('Certificate generation error:', err);
        throw err;
      } finally {
        setIsGenerating(false);
      }
    },
    [certificates]
  );

  const getCertificate = useCallback(
    (studentName, integrationKey) => {
      const cacheKey = `${studentName}-${integrationKey}`;
      return certificates[cacheKey] || null;
    },
    [certificates]
  );

  const clearCertificates = useCallback(() => {
    setCertificates({});
    setError(null);
  }, []);

  return {
    generateCertificate,
    getCertificate,
    clearCertificates,
    isGenerating,
    error,
    certificateCount: Object.keys(certificates).length,
  };
}
