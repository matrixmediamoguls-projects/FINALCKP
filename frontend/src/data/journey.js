import {
  Leaf,
  Flame,
  Drop,
  Wind,
  BookOpen,
  ChatText,
  Headphones,
  BookBookmark,
  CircleHalf,
  MagnifyingGlass,
  Robot,
  ShieldCheck,
} from "@phosphor-icons/react";

import act1Emblem from "../public/emblems/act_one_emblem.svg";
import act2Emblem from "../public/emblems/act_two_emblem.svg";
import act3Emblem from "../public/emblems/act_three_emblem.svg";
import act4Emblem from "../public/emblems/act_four_emblem.svg";

export const ACTS = [
  {
    num: 1,
    roman: "I",
    element: "Earth",
    tone: "earth",
    title: "The Fractured Veil",
    principle: "Awareness. Recognition. Naming what was hidden beneath the surface.",
    colorVar: "--clr-act-1",
    hex: "#5ab038",
    glyph: "AWAKENING",
    emblem: act1Emblem,
    icon: Leaf,
  },
  {
    num: 2,
    roman: "II",
    element: "Fire",
    tone: "fire",
    title: "Reclamation",
    principle: "Reclamation. Burning away what is not essential. Sovereignty.",
    colorVar: "--clr-act-2",
    hex: "#D85A30",
    glyph: "CONFRONTATION",
    emblem: act2Emblem,
    icon: Flame,
  },
  {
    num: 3,
    roman: "III",
    element: "Water",
    tone: "water",
    title: "The Reflection Chamber",
    principle: "Reflection. Shadow Work. Looking clearly into the mirror of self.",
    colorVar: "--clr-act-3",
    hex: "#50a0e0",
    glyph: "EMPOWERMENT",
    emblem: act3Emblem,
    icon: Drop,
  },
  {
    num: 4,
    roman: "IV",
    element: "Air",
    tone: "air",
    title: "The Crucible Code",
    principle: "Integration. Equilibrium. Holding all of it with grace.",
    colorVar: "--clr-act-4",
    hex: "#c8a020",
    glyph: "TRANSCENDENCE",
    emblem: act4Emblem,
    icon: Wind,
  },
];

export const JOURNEY_MODULES = [
  { id: "codex",    label: "Codex",    icon: BookOpen,       path: "/codex" },
  { id: "protocol", label: "Protocol", icon: ChatText,       path: "/protocol" },
  { id: "listen",   label: "Listen",   icon: Headphones,     path: "/listen" },
  { id: "journal",  label: "Journal",  icon: BookBookmark,   path: "/journal" },
  { id: "wheel",    label: "Wheel",    icon: CircleHalf,     path: "/wheel" },
  { id: "seeker",   label: "Seeker",   icon: MagnifyingGlass, path: "/seeker" },
  { id: "vma",      label: "VMA",      icon: Robot,          path: "/vma" },
  { id: "admin",    label: "Admin",    icon: ShieldCheck,    path: "/admin" },
];

export function buildProtocolPath(actNum, stepIndex = 0) {
  return `/activation?act=${actNum}`;
}

export function canAccessAct(user, actNum) {
  if (!user) return false;
  if (actNum === 1) return true;
  if (actNum === 4) return false;
  const tier = user.tier || "free";
  if (tier === "premium" || tier === "founder") return true;
  const completedActs = user.completed_acts || [];
  if (actNum === 3 && user.act3_unlocked) return true;
  return completedActs.includes(actNum - 1);
}

export function getActLockReason(user, actNum) {
  if (actNum === 4) return "Complete Acts I–III to unlock";
  if (actNum === 3) return "Unlock required";
  return "Complete the previous act to unlock";
}

export function getActStatus(user, actNum, activeAct) {
  if (actNum === 4) return "SEALED";
  const completedActs = user?.completed_acts || [];
  if (completedActs.includes(actNum)) return "COMPLETE";
  if (actNum === activeAct) return "ACTIVE";
  return "LOCKED";
}
