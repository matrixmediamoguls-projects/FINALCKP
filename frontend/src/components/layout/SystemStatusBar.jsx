export default function SystemStatusBar({
  intensity,
  particlesEnabled,
  visualsRunning,
  theme,
  currentTime = "0:00",
  duration = "0:00",
  totalDuration = "0:00",
  trackTitle = "NO TRACK",
}) {
  return (
    <section className="pva-system-bar">
      <div>
        <span>DATABASE</span>
        <strong>SUPABASE CONNECTED</strong>
      </div>
      <div>
        <span>NODE</span>
        <strong>{particlesEnabled ? "R2 LIVE" : "LOCAL"}</strong>
      </div>
      <div>
        <span>SECTOR</span>
        <strong>{visualsRunning ? "7 - EXTERIOR FEED" : theme}</strong>
      </div>
      <div>
        <span>PROTOCOL</span>
        <strong>{intensity > 35 ? "CKP ENCRYPTED" : "ARMED"}</strong>
      </div>
      <div>
        <span>TRACK</span>
        <strong>{trackTitle}</strong>
      </div>
      <div>
        <span>TIME</span>
        <strong>{currentTime} / {duration || totalDuration}</strong>
      </div>
    </section>
  );
}
