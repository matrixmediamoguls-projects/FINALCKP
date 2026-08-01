import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, BookOpen, Brain, Building2, Check, CircleDot,
  FileText, Flame, Globe2, Lightbulb, PenLine, RefreshCw, Sparkles,
  Target, Waves,
} from "lucide-react";
import suppliedCopy from "../../../data/hermeticSuppliedModules.txt?raw";
import "./hermeticMaterialExperience.css";
import "./hermeticReferenceExperience.css";

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

function MentalismPrincipleScreen({ section }) {
  const blocks = section.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean);
  return <div className="hme-principle-feature">
    <div className="hme-principle-copy">
      <p className="hme-central-question">Who was shaping your mind before you learned to shape it yourself?</p>
      <h2>{blocks[0]}</h2>
      <blockquote>{blocks[1]}</blockquote>
      {blocks.slice(2).map((block) => <p key={block}>{block}</p>)}
      <aside><Brain size={28}/><em>Mind precedes manifestation. Reclaim the patterns through which you engage with the world.</em></aside>
    </div>
    <figure className="hme-mind-figure">
      <img src="/reclamation-university/mentalism-mind-diagram.png" alt="A gilded Hermetic diagram of the mind shaping thought, belief, reality, and manifestation"/>
      <figcaption>
        <div><Sparkles/><span><strong>Thought</strong><small>The seed of all.</small></span></div>
        <div><Brain/><span><strong>Belief</strong><small>Thought repeated becomes belief.</small></span></div>
        <div><Target/><span><strong>Reality</strong><small>Belief shapes perception.</small></span></div>
        <div><Building2/><span><strong>The All</strong><small>The visible reflects the mind.</small></span></div>
      </figcaption>
    </figure>
  </div>;
}

function CopyScreen({ section, moduleTitle, moduleSlug, activeTab, response, onResponse }) {
  if (moduleSlug === "mentalism" && activeTab === "PRINCIPLE") return <MentalismPrincipleScreen section={section}/>;
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
  const [activeTab, setActiveTab] = useState("PRINCIPLE");
  const [response, setResponse] = useState("");
  const activeIndex = TABS.findIndex(([id]) => id === activeTab);
  const next = TABS[Math.min(activeIndex + 1, TABS.length - 1)];
  const screen = useMemo(() => <CopyScreen section={moduleCopy.sections[activeTab] || ""} moduleTitle={moduleCopy.title} moduleSlug={moduleSlug} activeTab={activeTab} response={response} onResponse={setResponse}/>, [activeTab, moduleCopy, moduleSlug, response]);

  return <main className="hme-root"><header className="hme-header"><div className="hme-brand"><span><Sparkles/></span><strong>Reclamation<br/>University</strong><i/><small>Hermetic Hall</small></div><div className="hme-progress"><span>Your progress</span><i><b style={{ width: `${progress || 42}%` }}/></i><strong>{progress || 42}%</strong></div></header><div className="hme-shell"><aside className="hme-tabs">{TABS.map(([id, label, Icon]) => <button type="button" key={id} className={id === activeTab ? "is-active" : ""} onClick={() => setActiveTab(id)}><span><Icon size={22}/></span><strong>{label}</strong></button>)}</aside><section className="hme-main"><PrincipleStrip activePrinciple={moduleCopy.index}/><article className="hme-stage"><header className="hme-lesson-title"><span>{PRINCIPLES[moduleCopy.index][0]}</span><div><h1>{moduleCopy.title}</h1><p>{moduleCopy.subtitle}</p></div></header><div className="hme-screen">{screen}</div><footer className="hme-footer"><div className="hme-stat"><small>Est. time</small><strong>18 min</strong></div><div className="hme-stat"><small>Principle {PRINCIPLES[moduleCopy.index][0]} of VII</small><strong>{moduleCopy.title}</strong></div><div className="hme-stat hme-lesson-progress"><small>Lesson progress</small><span>{TABS.map(([id], index) => <i key={id} className={index <= activeIndex ? "is-complete" : ""}/>)}</span></div>{activeTab !== "SUMMARY" ? <button type="button" onClick={() => setActiveTab(next[0])}>Continue to {next[1]} <ArrowRight size={20}/></button> : <button type="button" onClick={onComplete}>Next Module <ArrowRight size={20}/></button>}</footer></article></section></div></main>;
}
