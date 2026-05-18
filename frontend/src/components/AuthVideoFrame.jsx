const AUTH_VIDEO_URL = 'https://media.chromakeyprotocol.com/video/Act_Two_Initiation.mp4';

const AuthVideoFrame = () => (
  <div className="relative min-h-[42vh] overflow-hidden bg-[#050505] lg:min-h-screen">
    <video
      data-testid="auth-initiation-video"
      src={AUTH_VIDEO_URL}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Act Two Initiation"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,3,0.08)_0%,rgba(3,3,3,0.18)_46%,#030303_100%)] lg:bg-[linear-gradient(90deg,rgba(3,3,3,0.02)_38%,rgba(3,3,3,0.66)_78%,#030303_100%)]" />
    <div className="absolute inset-4 border border-chroma-gold/40 shadow-[0_0_28px_rgba(205,164,52,0.16)] lg:inset-8" />
    <div className="absolute left-6 top-6 h-10 w-10 border-l border-t border-chroma-gold/70 lg:left-12 lg:top-12" />
    <div className="absolute bottom-6 right-6 h-10 w-10 border-b border-r border-[#7ab829]/70 lg:bottom-12 lg:right-12" />
    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md lg:bottom-12 lg:left-12 lg:right-12">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-chroma-gold">
          Act II Initiation
        </div>
        <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-chroma-text-secondary">
          Chroma Key Protocol
        </div>
      </div>
      <div className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#7ab829] shadow-[0_0_10px_rgba(122,184,41,0.9)]" />
        <span className="h-1.5 w-6 bg-[#7ab829]/70" />
        <span className="h-1.5 w-4 bg-chroma-gold/70" />
      </div>
    </div>
  </div>
);

export default AuthVideoFrame;
