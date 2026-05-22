import { motion } from "framer-motion";

export default function ActPortal({
  title,
  subtitle,
  color,
  onClick
}) {
  return (
    <motion.div
      className="act-portal"
      whileHover={{
        scale: 1.05
      }}
      onClick={onClick}
      style={{
        borderColor: color
      }}
    >
      <div
        className="portal-glow"
        style={{
          background: color
        }}
      />

      <h2>{title}</h2>
      <p>{subtitle}</p>
    </motion.div>
  );
}