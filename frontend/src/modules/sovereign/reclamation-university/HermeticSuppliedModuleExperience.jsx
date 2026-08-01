import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, BookOpen, Brain, Building2, Check, CircleDot,
  FileText, Flame, Globe2, Lightbulb, PenLine, RefreshCw, Sparkles,
  Target, Waves,
} from "lucide-react";
import suppliedCopy from "../../../data/hermeticSuppliedModules.txt?raw";
import "./hermeticMaterialExperience.css";

const TABS = [
  ["INTRO", "Intro", BookOpen],
  ["PRINCIPLE", "Principle", Brain],
  ["KEY CONCEPTS", "Key Concepts", Lightbulb],
  ["WHY IT MATTERS", "Why It Matters", Sparkles],
  ["DOMAINS", "Domains", Building2],
  ["RECLAMATION", "Reclamation", Flame],
  ["2026 LENS", "2026 Lens", Globe2],
  ["REFLECTION", "Reflection", PenLine],
  ["PROTOCOL", "Protocol", Target],
  ["ARTIFACT", "Artifact", FileText],
  ["SUMMARY", "Summary", Check],
];

const PRINCIPLES = [
  ["I", "Mentalism", Brain, "#d7a64a"],
  ["II", "Correspondence", Globe2, "#4e8fb4"],
  ["III", "Vibration", Activity, "#e13b2f"],
  ["IV", "Polarity", CircleDot, "#d9c8a2"],
  ["V", "Rhythm", Waves, "#b98a36"],
  ["VI", "Cause & Effect", Target, "#8db55d"],
  ["VII", "Gender", RefreshCw, "#c14534"],
];

const MODULES = {
  mentalism: { index: 0, marker: "MODULE I — MENTALISM", title: "Mentalism", subtitle: "Before the Body, the All-Mind." },
  correspondence: { index: 1, marker: "MODULE II — CORRESPONDENCE", title: "Correspondence", subtitle: "As Within, So Without." },
};

const SECTION_PATTERN = new RegExp(`^(${TABS.map(([id]) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`, "gm");

function parseModules() {
  return Object.fromEntries(Object.entries(MODULES).map(([slug, metadata], moduleIndex, entries) => {
    const start = suppliedCopy.indexOf(metadata.marker);
    const nextMarker = entries[moduleIndex + 1]?.[1].marker;
    const end = nextMarker ? suppliedCopy.indexOf(nextMarker) : suppliedCopy.length;
    const source = suppliedCopy.slice(start + metadata.marker.length, end).trim();
    const matches = [...source.matchAll(SECTION_PATTERN)];
    const sections = Object.fromEntries(matches.map((match, index) => [
      match[1],
      source.slice(match.index + match[0].length, matches[index + 1]?.index ?? source.length).trim(),
    ]));
    return [slug, { ...metadata, sections }];
  }));
}

export const MODULE_COPY = parseModules();
const LABELS = new Set([
  "Title", "Subtitle", "Central Question", "Observation", "Pattern", "Why It Matters",
  "Context", "Featured Lyric", "Analysis", "Reclamation Insight", "Hermetic Connection",
  "Practical Insight", "Reflection Prompt", "Supporting Prompts", "Protocol Name", "Purpose",
  "When to Use", "Process", "Worked Example", "What's Happening?",
]);

function PrincipleStrip({ activePrinciple }) {
  return <div className="hme-principles" aria-label="The seven Hermetic principles">{PRINCIPLES.map(([roman, name, Icon, accent], index) => <button key={name} type="button" className={index === activePrinciple ? "is-active" : ""} style={{ "--principle-accent": accent }}><span>{roman}</span><Icon size={27}/><strong>{name}</strong></button>)}</div>;
}

function CopyScreen({ section, moduleTitle, response, onResponse }) {
  const blocks = section.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  const filtered = blocks.filter((block, index) => {
    if (block === "Title" || block === "Subtitle") return false;
    if (index > 0 && (blocks[index - 1] === "Title" || blocks[index - 1] === "Subtitle")) return false;
    return block !== "Correspondence";
  });
  const isReflection = section.includes("Reflection Prompt");
  return <div className="hme-editorial">
    <section className="hme-panel">
      {filtered.map((block, index) => {
        if (LABELS.has(block)) return <h3 key={`${block}-${index}`}>{block}</h3>;
        if (/^\d+\.\s/.test(block)) return <h4 key={`${block}-${index}`}>{block}</h4>;
        if ((block.startsWith('"') && block.endsWith('"')) || block.startsWith("The central lesson")) return <blockquote key={`${block}-${index}`}>{block}</blockquote>;
        const lines = block.split("\n").filter(Boolean);
        if (lines.length > 1) return <ul key={`${block}-${index}`}>{lines.map((line) => <li key={line}>{line}</li>)}</ul>;
        return <p key={`${block}-${index}`} className={index === 0 ? "hme-lede" : undefined}>{block}</p>;
      })}
    </section>
    {isReflection && <section className="hme-panel"><h3>Your Reflection</h3><textarea value={response} onChange={(event) => onResponse(event.target.value)} placeholder={`Record what ${moduleTitle} helps you notice...`}/></section>}
  </div>;
}

export default function HermeticSuppliedModuleExperience({ moduleSlug, progress = 0, onComplete }) {
  const moduleCopy = MODULE_COPY[moduleSlug];
  const [activeTab, setActiveTab] = useState("INTRO");
  const [response, setResponse] = useState("");
  const activeIndex = TABS.findIndex(([id]) => id === activeTab);
  const next = TABS[Math.min(activeIndex + 1, TABS.length - 1)];
  const screen = useMemo(() => <CopyScreen section={moduleCopy.sections[activeTab] || ""} moduleTitle={moduleCopy.title} response={response} onResponse={setResponse}/>, [activeTab, moduleCopy, response]);

  return <main className="hme-root"><header className="hme-header"><div className="hme-brand"><span>RU</span><div><strong>Reclamation University</strong><small>Hermetic Hall</small></div></div><div className="hme-progress"><span>Your progress</span><i><b style={{ width: `${progress}%` }}/></i><strong>{progress}%</strong></div></header><div className="hme-shell"><aside className="hme-tabs">{TABS.map(([id, label, Icon]) => <button type="button" key={id} className={id === activeTab ? "is-active" : ""} onClick={() => setActiveTab(id)}><Icon size={18}/><span>{label}</span></button>)}</aside><section className="hme-main"><PrincipleStrip activePrinciple={moduleCopy.index}/><header className="hme-lesson-title"><span>{PRINCIPLES[moduleCopy.index][0]}</span><div><h1>{moduleCopy.title}</h1><p>{moduleCopy.subtitle}</p></div></header><div className="hme-screen">{screen}</div><footer className="hme-footer"><div><small>Principle {PRINCIPLES[moduleCopy.index][0]} of VII</small><strong>{moduleCopy.title}</strong></div>{activeTab !== "SUMMARY" ? <button type="button" onClick={() => setActiveTab(next[0])}>Continue to {next[1]} <ArrowRight size={17}/></button> : <button type="button" onClick={onComplete}>Next Module <ArrowRight size={17}/></button>}</footer></section></div></main>;
}
