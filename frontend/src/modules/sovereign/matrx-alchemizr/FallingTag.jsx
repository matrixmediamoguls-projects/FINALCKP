export default function FallingTag({ tag, onCollect, onExpire }) {
  return (
    <button
      type="button"
      className="alchemizr-falling-tag"
      style={{
        left: `${tag.left}%`,
        color: tag.color,
        animationDuration: `${tag.duration}s`,
      }}
      onClick={() => onCollect(tag)}
      onAnimationEnd={() => onExpire(tag.id)}
    >
      {tag.label}
    </button>
  );
}
