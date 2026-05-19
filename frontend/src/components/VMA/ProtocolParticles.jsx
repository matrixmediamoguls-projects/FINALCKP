const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: 8 + ((index * 23) % 84),
  y: 8 + ((index * 37) % 82),
  delay: (index % 9) * 0.23,
  size: 2 + (index % 3),
}));

export default function ProtocolParticles() {
  return (
    <div className="vma-particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            "--x": `${particle.x}%`,
            "--y": `${particle.y}%`,
            "--delay": `${particle.delay}s`,
            "--size": `${particle.size}px`,
          }}
        />
      ))}
    </div>
  );
}
