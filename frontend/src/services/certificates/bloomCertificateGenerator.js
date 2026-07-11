/**
 * Bloom Certificate Generator
 * 
 * Generates high-quality PDF certificates for Reclamation University module completion.
 * Uses Typst for professional typography and layout.
 * 
 * Certificates include:
 * - Student name and completion date
 * - Module title and faculty
 * - Integration key and XP reward
 * - Chroma Key Protocol design language
 * - Tamper-evident security features
 */

/**
 * Generate a Bloom Certificate for module completion
 * 
 * @param {object} options - Certificate generation options
 * @param {string} options.studentName - Name of the student
 * @param {string} options.facultyTitle - Title of the faculty
 * @param {string} options.moduleTitle - Title of the module
 * @param {string} options.integrationKey - Integration key from module completion
 * @param {number} options.xpReward - XP points earned
 * @param {Date} options.completionDate - Date of completion
 * @returns {Promise<Blob>} - PDF certificate as blob
 */
export async function generateBloomCertificate({
  studentName,
  facultyTitle,
  moduleTitle,
  integrationKey,
  xpReward,
  completionDate = new Date(),
}) {
  // Format the completion date
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedDate = dateFormatter.format(completionDate);

  // Generate certificate ID (hash of student name + date + key)
  const certificateId = generateCertificateId(studentName, completionDate, integrationKey);

  // Create Typst template for certificate
  const typstContent = generateTypstTemplate({
    studentName,
    facultyTitle,
    moduleTitle,
    integrationKey,
    xpReward,
    formattedDate,
    certificateId,
  });

  // Call backend API to render Typst to PDF
  try {
    const response = await fetch('/api/certificates/render', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        typstContent,
        certificateId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Certificate generation failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
}

/**
 * Generate a unique certificate ID
 */
function generateCertificateId(studentName, date, integrationKey) {
  const timestamp = date.getTime();
  const hash = `${studentName}-${timestamp}-${integrationKey}`.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

/**
 * Generate Typst template for certificate
 */
function generateTypstTemplate({
  studentName,
  facultyTitle,
  moduleTitle,
  integrationKey,
  xpReward,
  formattedDate,
  certificateId,
}) {
  return `#set page(
  paper: "a4",
  margin: (top: 1.5cm, bottom: 1.5cm, left: 1.5cm, right: 1.5cm),
  background: [
    #set text(fill: rgb("#0a0a0a"))
    #box(
      width: 100%,
      height: 100%,
      fill: rgb("#ffffff"),
      stroke: (paint: rgb("#dc2626"), thickness: 3pt),
    )
  ],
)

#set text(font: "Courier New", size: 11pt, fill: rgb("#1f2937"))

// Header
#align(center)[
  #text(size: 24pt, weight: "bold", fill: rgb("#dc2626"))[
    BLOOM CERTIFICATE
  ]
  
  #text(size: 10pt, fill: rgb("#6b7280"))[
    Reclamation University
  ]
]

#v(1cm)

// Main content
#align(center)[
  #text(size: 14pt, weight: "bold")[
    This certifies that
  ]
  
  #v(0.5cm)
  
  #text(size: 18pt, weight: "bold", fill: rgb("#dc2626"))[
    ${studentName}
  ]
  
  #v(0.5cm)
  
  #text(size: 12pt)[
    has successfully completed
  ]
  
  #v(0.3cm)
  
  #text(size: 14pt, weight: "bold")[
    ${moduleTitle}
  ]
  
  #v(0.2cm)
  
  #text(size: 11pt, fill: rgb("#6b7280"))[
    Faculty of ${facultyTitle}
  ]
]

#v(1cm)

// Details grid
#grid(
  columns: (1fr, 1fr),
  gutter: 1cm,
  [
    #text(size: 10pt, weight: "bold", fill: rgb("#6b7280"))[COMPLETION DATE]
    #text(size: 11pt)[${formattedDate}]
  ],
  [
    #text(size: 10pt, weight: "bold", fill: rgb("#6b7280"))[EXPERIENCE POINTS]
    #text(size: 11pt)[${xpReward} XP]
  ],
  [
    #text(size: 10pt, weight: "bold", fill: rgb("#6b7280"))[INTEGRATION KEY]
    #text(size: 9pt, font: "Courier New")[${integrationKey}]
  ],
  [
    #text(size: 10pt, weight: "bold", fill: rgb("#6b7280"))[CERTIFICATE ID]
    #text(size: 9pt, font: "Courier New")[${certificateId}]
  ],
)

#v(1cm)

// Signature line
#line(length: 40%, stroke: (paint: rgb("#dc2626"), thickness: 1pt))
#text(size: 9pt, fill: rgb("#6b7280"))[Reclamation University Authority]

#v(0.5cm)

// Footer
#align(center)[
  #text(size: 8pt, fill: rgb("#9ca3af"))[
    This certificate verifies completion of the Reclamation University curriculum.
    Issued on ${formattedDate} under the authority of the Chroma Key Protocol.
    Certificate ID: ${certificateId}
  ]
]
`;
}

/**
 * Download certificate to user's device
 */
export async function downloadCertificate(certificateBlob, studentName, moduleTitle) {
  const url = URL.createObjectURL(certificateBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Bloom_Certificate_${studentName.replace(/\s+/g, '_')}_${moduleTitle.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Share certificate (generates shareable link or social media preview)
 */
export async function shareCertificate(certificateId, studentName, moduleTitle) {
  const shareUrl = `${window.location.origin}/certificates/${certificateId}`;
  const shareText = `I completed "${moduleTitle}" at Reclamation University and earned my Bloom Certificate! 🔥`;

  return {
    url: shareUrl,
    text: shareText,
    title: `${studentName}'s Bloom Certificate`,
  };
}

/**
 * Verify certificate authenticity (checks signature and ID)
 */
export async function verifyCertificate(certificateId, studentName, completionDate) {
  try {
    const response = await fetch(`/api/certificates/verify/${certificateId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentName,
        completionDate,
      }),
    });

    if (!response.ok) {
      return { valid: false, error: 'Certificate verification failed' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return { valid: false, error: error.message };
  }
}
