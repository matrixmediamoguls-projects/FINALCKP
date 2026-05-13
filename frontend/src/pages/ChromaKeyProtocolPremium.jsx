const C = {
  background: '#07090c',
  panel: '#0b1015',
  border: '#20272f',
  secondary: '#111821',
  primary: '#d6a441',
  blue: '#64c7ff',
  green: '#98d84a',
  overlay: '#091016',
  foreground: '#edf2f7',
};

const fontHeadings = "'Space Grotesk', sans-serif";

export default function ChromaKeyProtocolPremium() {
  return (
    <div style={{ background: C.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: 1440, height: 900, background: C.background, overflow: 'hidden', flexShrink: 0 }}>

        {/* Layered decorative frames */}
        <div style={{ position: 'absolute', left: 56, top: 56, width: 1328, height: 788, borderRadius: 24, border: `1px solid ${C.border}`, background: C.panel }} />
        <div style={{ position: 'absolute', left: 68, top: 68, width: 1304, height: 764, borderRadius: 24, border: `1px solid ${C.blue}`, background: C.background }} />
        <div style={{ position: 'absolute', left: 80, top: 80, width: 1280, height: 740, borderRadius: 24, border: `1px solid ${C.primary}`, background: C.panel }} />

        {/* Video */}
        <div style={{ position: 'absolute', left: 104, top: 132, width: 1232, height: 612, borderRadius: 16, border: `1px solid ${C.border}`, background: C.background, overflow: 'hidden' }}>
          <video
            src="https://media.chromakeyprotocol.com/video/chroma_key_protocol_launch_sequence.mp4"
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: C.overlay, opacity: 0.2, pointerEvents: 'none' }} />
        </div>

        {/* Soft inner border layers */}
        <div style={{ position: 'absolute', left: 86, top: 86, width: 1268, height: 728, borderRadius: 24, border: `1px solid ${C.blue}`, opacity: 0.8, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 96, top: 96, width: 1248, height: 708, borderRadius: 24, border: `1px solid ${C.primary}`, opacity: 0.8, pointerEvents: 'none' }} />

        {/* Header — logo + title */}
        <div style={{ position: 'absolute', left: 120, top: 48, display: 'flex', alignItems: 'center', gap: 24 }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/banani-prod.appspot.com/o/reference-images%2Fd3526f31-e65b-4642-bccd-c79d30512556?alt=media&token=a8c1f44c-cc2f-4bb6-918d-717aeb72021f"
            alt="Chroma Key Protocol"
            style={{ width: 62, height: 62, objectFit: 'contain' }}
          />
          <div style={{ fontFamily: fontHeadings, fontSize: 24, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.primary }}>
            Chroma Key Protocol
            <span style={{ padding: '0 12px', color: C.blue }}>|</span>
            Musiq Matrix Mainframe
          </div>
        </div>

        {/* Header — status badge */}
        <div style={{ position: 'absolute', right: 120, top: 54, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${C.green}`, background: C.secondary, borderRadius: 8, padding: '12px 20px' }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', border: `1px solid ${C.green}`, background: C.green, flexShrink: 0 }} />
          <div style={{ fontFamily: fontHeadings, fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.26em', color: C.green }}>
            Mainframe Activated
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 4 }}>
            {[1, 0.7, 0.4].map((o, i) => (
              <span key={i} style={{ display: 'block', width: 18, height: 8, borderRadius: 999, background: C.green, opacity: o }} />
            ))}
          </div>
        </div>

        {/* Footer left */}
        <div style={{ position: 'absolute', left: 120, bottom: 50, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontFamily: fontHeadings, fontSize: 20, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.primary }}>
            Chrome Edition
          </div>
          <div style={{ height: 1, width: 120, background: C.blue }} />
          <div style={{ fontFamily: fontHeadings, fontSize: 20, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.blue }}>
            Autoplay Sequence
          </div>
        </div>

        {/* Footer right */}
        <div style={{ position: 'absolute', right: 120, bottom: 50 }}>
          <button style={{
            border: `1px solid ${C.primary}`,
            background: C.secondary,
            borderRadius: 8,
            padding: '12px 20px',
            fontFamily: fontHeadings,
            fontSize: 18,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: C.primary,
            cursor: 'pointer',
          }}>
            TRANSMITTING
          </button>
        </div>

        {/* Vertical side labels */}
        <div style={{ position: 'absolute', left: 44, top: 210, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', fontFamily: fontHeadings, fontSize: 18, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.blue }}>
          Chroma Key Protocol
        </div>
        <div style={{ position: 'absolute', right: 44, top: 210, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', fontFamily: fontHeadings, fontSize: 18, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.18em', color: C.primary }}>
          Musiq Matrix Mainframe
        </div>

        {/* Corner accent bars */}
        <div style={{ position: 'absolute', left: 118, top: 108, width: 220, height: 8, borderRadius: 999, background: C.blue }} />
        <div style={{ position: 'absolute', right: 118, top: 108, width: 220, height: 8, borderRadius: 999, background: C.primary }} />
        <div style={{ position: 'absolute', left: 118, bottom: 108, width: 220, height: 8, borderRadius: 999, background: C.primary }} />
        <div style={{ position: 'absolute', right: 118, bottom: 108, width: 220, height: 8, borderRadius: 999, background: C.blue }} />

      </div>
    </div>
  );
}
