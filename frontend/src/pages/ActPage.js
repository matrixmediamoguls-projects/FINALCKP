import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import CodexDossier from "../components/codex/CodexDossier";
import { useAuth } from "../context/AuthContext";
import { codexData, TONE_TOKENS } from "../data/actCodexData";
import { buildProtocolPath, canAccessAct } from "../data/journey";

const parseActNumber = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? parsed : null;
};

const getCompletedActs = (completedActs) =>
  Array.isArray(completedActs) ? completedActs.map((act) => Number(act)) : [];

const ActPage = () => {
  const { actNumber } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();
  const [reflections, setReflections] = useState({});

  const isHub = !actNumber;
  const routeAct = parseActNumber(actNumber);
  const queryActParam = searchParams.get("act");
  const queryAct = parseActNumber(queryActParam);
  const currentAct = parseActNumber(user?.current_act) || 1;
  const actNum = routeAct || queryAct || currentAct;
  const act = codexData[actNum];
  const tok = act ? TONE_TOKENS[act.tone] : null;
  const hasAccess = canAccessAct(user, actNum);

  const completedActs = useMemo(() => getCompletedActs(user?.completed_acts), [user?.completed_acts]);

  const fetchReflections = useCallback(async () => {
    if (!act || !hasAccess) {
      setReflections({});
      return;
    }

    try {
      const res = await axios.get(`/reflections/${actNum}`);
      setReflections(res.data.items || {});
    } catch {
      setReflections({});
    }
  }, [act, actNum, hasAccess]);

  useEffect(() => {
    const invalidRouteAct = actNumber && !routeAct;
    const invalidQueryAct = isHub && queryActParam && !queryAct;
    if (invalidRouteAct || invalidQueryAct || !act) {
      navigate("/dashboard", { replace: true });
      return;
    }

    fetchReflections();
  }, [act, actNumber, fetchReflections, isHub, navigate, queryAct, queryActParam, routeAct]);

  const handleSelectAct = (nextAct) => {
    if (isHub) {
      setSearchParams({ act: String(nextAct) });
      return;
    }
    navigate(`/act/${nextAct}`);
  };

  const handleAdjacentAct = (nextAct) => {
    if (nextAct < 1 || nextAct > 4) return;
    handleSelectAct(nextAct);
  };

  const handleReflectionChange = async (index, checked) => {
    const itemId = `protocol_${index}`;
    try {
      await axios.put("/reflections", { act: actNum, item_id: itemId, checked });
      setReflections((prev) => ({ ...prev, [itemId]: checked }));
    } catch {
      /* Reflections are best-effort; the UI keeps the last confirmed state. */
    }
  };

  const handleCompleteAct = async () => {
    if (!hasAccess || completedActs.includes(actNum)) return;

    const newCompleted = [...completedActs, actNum]
      .filter((value, index, arr) => arr.indexOf(value) === index)
      .sort((a, b) => a - b);
    const newLevel = Math.min(newCompleted.length + 1, 4);
    await updateProgress({
      completed_acts: newCompleted,
      level: newLevel,
      current_act: Math.min(actNum + 1, 4),
    });
  };

  const handleProtocol = () => {
    if (!hasAccess) {
      navigate(actNum === 4 ? "/act/4" : "/dashboard?showUnlock=true");
      return;
    }
    navigate(buildProtocolPath(actNum, 0));
  };

  const handleImmersion = () => {
    if (!hasAccess) {
      navigate(actNum === 4 ? "/act/4" : "/dashboard?showUnlock=true");
      return;
    }
    navigate(`/listen/${actNum}`);
  };

  if (!act || !tok) return null;

  return (
    <CodexDossier
      act={act}
      actNum={actNum}
      isHub={isHub}
      user={user}
      tok={tok}
      reflections={reflections}
      onReflectionChange={handleReflectionChange}
      onCompleteAct={handleCompleteAct}
      onSelectAct={handleSelectAct}
      onBack={() => navigate("/dashboard")}
      onPrevious={() => handleAdjacentAct(actNum - 1)}
      onNext={() => handleAdjacentAct(actNum + 1)}
      onProtocol={handleProtocol}
      onImmersion={handleImmersion}
      onJournal={() => navigate("/journal")}
      onUnlock={() => navigate(actNum === 4 ? "/act/4" : "/dashboard?showUnlock=true")}
    />
  );
};

export default ActPage;
