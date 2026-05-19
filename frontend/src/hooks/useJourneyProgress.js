import { useMemo } from "react";
import { ACTS } from "../data/journey";

export default function useJourneyProgress(user) {
  return useMemo(() => {
    const completedActs = user?.completed_acts || [];
    const activeAct = user?.current_act || 1;
    const completedSteps = [];

    const nextStepIndex = completedSteps.length;

    const actMeta = ACTS.find((a) => a.num === activeAct) || ACTS[0];
    const nextAction = {
      path: `/activation?act=${activeAct}`,
      label: `Continue Act ${actMeta.roman}`,
      eyebrow: `Act ${actMeta.roman} — ${actMeta.element}`,
      description: actMeta.principle,
    };

    return { activeAct, completedActs, completedSteps, nextAction, nextStepIndex };
  }, [user]);
}
