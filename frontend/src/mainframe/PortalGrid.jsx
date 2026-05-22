import { useState } from "react";
import ReclamationCodex
from "../acts/reclamation/ReclamationCodex";
import ActPortal from "./ActPortal";

export default function PortalGrid() {
  return (
    <div className="portal-grid">

      <ActPortal
        title="THE FRACTURED VEIL"
        subtitle="EARTH"
        color="#54ff9f"
      />

      <ActPortal
        title="THE REFLECTION CHAMBER"
        subtitle="WATER"
        color="#5ab6ff"
      />

      <ActPortal
        title="RECLAMATION"
        subtitle="FIRE"
        color="#ff4d4d"
      />

      <ActPortal
        title="THE CRUCIBLE CODE"
        subtitle="AIR"
        color="#ffc857"
      />

    </div>
  );

 const [activeAct, setActiveAct]
  = useState(null);

if (activeAct === "reclamation") {
  return <ReclamationCodex />;
} 
}