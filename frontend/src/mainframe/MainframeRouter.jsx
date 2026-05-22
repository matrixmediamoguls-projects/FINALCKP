import { useState } from "react";

import ProtocolBoot from "./ProtocolBoot";
import PortalGrid from "./PortalGrid";

export default function MainframeRouter() {
  const [activated, setActivated] =
    useState(false);

  if (!activated) {
    return (
      <ProtocolBoot
        onActivate={() =>
          setActivated(true)
        }
      />
    );
  }

  return <PortalGrid />;
}