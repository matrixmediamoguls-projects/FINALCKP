import {
  Article,
  Compass,
  Crown,
  Diamond,
  Fire,
  GearSix,
  MusicNotes,
  Notebook,
  ShieldChevron,
  Spiral,
  WaveSine,
} from "@phosphor-icons/react";
import { UNLOCK_ALL_ACCESS } from "../lib/accessFlags";
import actDefs from "./actDefinitions";
import actOneEmblem from "../public/emblems/act_one_emblem.gif";
import actTwoEmblem from "../public/emblems/act_two_emblem.gif";
import actThreeEmblem from "../public/emblems/act_three_emblem.gif";
import actFourEmblem from "../public/emblems/act_four_emblem.gif";

export const ACTS = [
  {
    num: 1,
    roman: "I",
    element: "Earth",
    title: "The Fractured Veil",
    shortTitle: "Fractured Veil",
    principle: "Awareness / Recognition / Naming what was hidden.",
    tone: "earth",
    colorVar: "--earth",
    hex: "#3DFF88",
    glyph: "⊕",
    icon: Diamond,
    emblem: actOneEmblem,
  },
  {
    num: 2,
    roman: "II",
    element: "Water",
    title: "The Reflection Chamber",
    shortTitle: "Reflection Chamber",
    principle: "Reflection / Shadow Work / The Mirror.",
    tone: "water",
    colorVar: "--water",
    hex: "#38D9FF",
    glyph: "≋",
    icon: WaveSine,
    emblem: actTwoEmblem,
  },
  {
    num: 3,
    roman: "III",
    element: "Fire",
    title: "Reclamation",
    shortTitle: "Reclamation",
    principle: "Reclamation / 30 Keys / Sovereignty.",
    tone: "fire",
    colorVar: "--fire",
    hex: "#FF5A34",
    glyph: "△",
    icon: Fire,
    emblem: actThreeEmblem,
  },
  {
    num: 4,
    roman: "IV",
    element: "Air",
    title: "The Crucible Code",
    shortTitle: "Crucible Code",
    principle: "Integration / Equilibrium / Grace.",
    tone: "air",
    colorVar: "--air",
    hex: "#F5D061",
    glyph: "✦",
    icon: Crown,
    emblem: actFourEmblem,
  },
];

export const JOURNEY_MODULES = [
  { id: "acts", label: "Acts", path: "/", icon: ShieldChevron },
  { id: "seeker", label: "The Seeker", path: "/seeker", icon: Compass },
  { id: "listen", label: "Immersion", path: "/listen", icon: MusicNotes },
  { id: "wheel", label: "Wheel", path: "/wheel", icon: Spiral },
  { id: "journal", label: "Journal", path: "/journal", icon: Notebook },
  { id: "codex", label: "Codex", path: "/codex", icon: Article },
  { id: "admin", label: "Admin", path: "/admin", icon: GearSix, adminOnly: true },
];

export const stateNames = ["Observer", "Participant", "Decoder", "Architect"];

export const getActMeta = (actNumber = 1) =>
  ACTS.find((act) => act.num === Number(actNumber)) || ACTS[0];

export const normalizeCompletedActs = (completedActs) =>
  Array.isArray(completedActs)
    ? completedActs.map((act) => Number(act)).filter((act) => act >= 1 && act <= 4)
    : [];

export const userHasFullAccess = (user) => {
  const tier = user?.tier || "free";
  return Boolean(
    UNLOCK_ALL_ACCESS ||
      user?.is_admin ||
      user?.act3_unlocked ||
      tier === "license" ||
      tier === "full",
  );
};

export const canAccessAct = (user, actNumber) => {
  const act = Number(actNumber);
  if (UNLOCK_ALL_ACCESS || user?.is_admin) return true;
  if (act <= 2) return true;
  if (act === 3) return userHasFullAccess(user);
  return false;
};

export const getActLockReason = (user, actNumber) => {
  const act = Number(actNumber);
  if (canAccessAct(user, act)) return "";
  if (act === 3) return "Unlock Act III with license, full access, or admin access.";
  if (act === 4) return "Act IV is sealed until the integration threshold opens.";
  return "This act is not available yet.";
};

export const getActStatus = (user, actNumber, activeAct) => {
  const act = Number(actNumber);
  const completed = normalizeCompletedActs(user?.completed_acts);
  if (completed.includes(act)) return "Complete";
  if (!canAccessAct(user, act)) return act === 4 ? "Sealed" : "Locked";
  if (act === Number(activeAct)) return "Active";
  return "Available";
};

export const getCompletedStepIndexes = (steps) =>
  (Array.isArray(steps) ? steps : [])
    .filter((step) => step?.completed)
    .map((step) => Number(step.step))
    .filter((step) => step >= 0 && step <= 4)
    .sort((a, b) => a - b);

export const getNextStepIndex = (steps, actNumber) => {
  const completed = getCompletedStepIndexes(steps);
  const count = actDefs[actNumber]?.steps?.length || 5;
  for (let i = 0; i < count; i += 1) {
    if (!completed.includes(i)) return i;
  }
  return count - 1;
};

export const getActStepLabel = (actNumber, stepIndex) => {
  const step = actDefs[actNumber]?.steps?.[stepIndex];
  return step?.name || "Continue the protocol";
};

export const buildProtocolPath = (actNumber, stepIndex = 0) =>
  `/protocol/${actNumber}?step=${Math.max(0, Math.min(4, Number(stepIndex) || 0))}`;

export const deriveNextAction = ({ user, stepRecords = [], activeAct }) => {
  const completedActs = normalizeCompletedActs(user?.completed_acts);
  const currentAct = Math.max(1, Math.min(4, Number(activeAct || user?.current_act || 1)));
  const activeMeta = getActMeta(currentAct);

  if (completedActs.length >= 4) {
    return {
      label: "Write Final Reflection",
      eyebrow: "Journey Complete",
      path: "/journal",
      act: 4,
      step: 4,
      description: "All acts are sealed in the record. The next move is integration.",
      icon: Notebook,
    };
  }

  if (!canAccessAct(user, currentAct)) {
    return {
      label: currentAct === 4 ? "Review Your Path" : "Unlock Act III",
      eyebrow: currentAct === 4 ? "Act IV Sealed" : "Access Threshold",
      path: currentAct === 4 ? "/dashboard" : "/dashboard?showUnlock=true",
      act: currentAct,
      step: 0,
      description: getActLockReason(user, currentAct),
      icon: ShieldChevron,
    };
  }

  const nextStep = getNextStepIndex(stepRecords, currentAct);
  return {
    label: `Continue Act ${activeMeta.roman}`,
    eyebrow: `Step ${String(nextStep + 1).padStart(2, "0")} of 05`,
    path: buildProtocolPath(currentAct, nextStep),
    act: currentAct,
    step: nextStep,
    description: getActStepLabel(currentAct, nextStep),
    icon: ShieldChevron,
  };
};
