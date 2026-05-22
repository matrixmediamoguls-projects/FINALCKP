import { motion } from "framer-motion";

export default function ProtocolBoot({ onActivate }) {
  return (
    <motion.div
      className="protocol-boot"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="boot-center">
        <h1>CHROMA KEY PROTOCOL</h1>

        <button onClick={onActivate}>
          ACTIVATE PROTOCOL
        </button>
      </div>
    </motion.div>
  );
}