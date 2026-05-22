import { AnimatePresence } from "framer-motion";
import AmbientEngine from "../systems/AmbientEngine";
import TransitionSystem from "../systems/TransitionSystem";
import MainframeRouter from "./MainframeRouter";

export default function MainframeShell() {
  return (
    <div className="mainframe-shell">
      <AmbientEngine />
      <TransitionSystem />

      <AnimatePresence mode="wait">
        <MainframeRouter />
      </AnimatePresence>
    </div>
  );
}