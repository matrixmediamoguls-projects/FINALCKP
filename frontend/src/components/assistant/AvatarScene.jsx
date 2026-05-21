export default function AvatarScene({ mode, voicePrimed }) {
  return (
    <div className="vma-avatar-scene" aria-hidden="true">
      <div className="vma-field-grid" />
      <div className="vma-agent-scanline" />
      <div className="vma-agent-hologram">
        <div className="vma-agent-crown" />
        <div className="vma-agent-head">
          <span />
          <span />
        </div>
        <div className="vma-agent-neck" />
        <div className="vma-agent-torso">
          <span />
          <span />
          <span />
        </div>
        <div className="vma-agent-core" />
      </div>
      <div className="vma-agent-base">
        <span>{mode}</span>
        <strong>{voicePrimed ? "VOICE CHANNEL" : "TEXT CHANNEL"}</strong>
      </div>
    </div>
  );
}
