import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  deriveNextAction,
  getActMeta,
  getCompletedStepIndexes,
  getNextStepIndex,
  normalizeCompletedActs,
} from "../data/journey";

export const useJourneyProgress = (user, actOverride) => {
  const activeAct = Math.max(1, Math.min(4, Number(actOverride || user?.current_act || 1)));
  const [stepRecords, setStepRecords] = useState([]);
  const [loadingSteps, setLoadingSteps] = useState(false);

  const refreshSteps = useCallback(async () => {
    if (!user) return;
    setLoadingSteps(true);
    try {
      const res = await axios.get(`/protocol/steps/${activeAct}`);
      setStepRecords(res.data.steps || []);
    } catch (error) {
      setStepRecords([]);
    } finally {
      setLoadingSteps(false);
    }
  }, [activeAct, user]);

  useEffect(() => {
    refreshSteps();
  }, [refreshSteps]);

  const completedActs = useMemo(
    () => normalizeCompletedActs(user?.completed_acts),
    [user?.completed_acts],
  );

  const completedSteps = useMemo(
    () => getCompletedStepIndexes(stepRecords),
    [stepRecords],
  );

  const nextStepIndex = useMemo(
    () => getNextStepIndex(stepRecords, activeAct),
    [activeAct, stepRecords],
  );

  const nextAction = useMemo(
    () => deriveNextAction({ user, stepRecords, activeAct }),
    [activeAct, stepRecords, user],
  );

  return {
    activeAct,
    activeActMeta: getActMeta(activeAct),
    completedActs,
    completedSteps,
    completionPercent: Math.round((completedActs.length / 4) * 100),
    loadingSteps,
    nextAction,
    nextStepIndex,
    refreshSteps,
    stepRecords,
  };
};

export default useJourneyProgress;
