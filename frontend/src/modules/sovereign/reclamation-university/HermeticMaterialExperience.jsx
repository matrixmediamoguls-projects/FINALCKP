import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  Check,
  ChevronDown,
  CircleDot,
  Download,
  Eye,
  FileText,
  Flame,
  Globe2,
  Heart,
  Lightbulb,
  Pause,
  PenLine,
  Play,
  RefreshCw,
  Save,
  Sparkles,
  Target,
  Waves,
} from "lucide-react";
import "./hermeticMaterialExperience.css";

const TABS = [
  ["intro", "Intro", BookOpen],
  ["principle", "Principle", Brain],
  ["key-concepts", "Key Concepts", Lightbulb],
  ["why-it-matters", "Why It Matters", Sparkles],
  ["domains", "Domains", Building2],
  ["reclamation", "Reclamation", Flame],
  ["2026-lens", "2026 Lens", Globe2],
  ["reflection", "Reflection", PenLine],
  ["protocol", "Protocol", Target],
  ["artifact", "Artifact", FileText],
  ["summary", "Summary", Check],
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

const DOMAIN_CARDS = [
  ["Biology", "Organisms respond not only to stimuli, but to encoded information that guides growth, adaptation, and behavior.", "Internal information shapes external form and function.", "What is invisible at the level of code often determines what becomes visible in life."],
  ["Psychology", "Repeated thoughts shape attention, emotion, and self perception.", "Inner narrative becomes outer behavior.", "The mind does not merely reflect experience. It participates in creating it."],
  ["Technology", "Software instructions determine what a device displays, calculates, and performs.", "The unseen program governs the visible output.", "To change outcomes, you often have to change the code beneath them."],
  ["Organizations", "A team’s assumptions and culture shape decisions long before policies are written down.", "Shared mentality produces shared structure.", "Systems are often built from beliefs before they are built from rules."],
  ["Economics", "Markets respond to expectations, sentiment, and confidence as much as material conditions.", "Perception influences behavior, and behavior reshapes reality.", "Collective belief can move real systems, not just private feelings."],
  ["Creativity", "Every work begins as an image, concept, or intention before it takes form.", "The inner blueprint precedes expression.", "Creation starts in thought before it appears in matter."],
];

const MODERN_CARDS = [
  ["Artificial Intelligence", "AI tools are becoming part of writing, search, design, and daily decision making.", "Invisible prompts, models, and instructions shape visible outputs.", "Examine the assumptions behind a system, not only the result it produces."],
  ["Social Media", "Platforms reward attention, emotion, and rapid reaction, shaping what people repeatedly see.", "Collective focus influences perception, identity, and public reality.", "Guard what you repeatedly consume because repeated signals become inner narrative."],
  ["The Attention Economy", "Modern products compete to capture and hold attention for as long as possible.", "Where attention goes, thought patterns strengthen.", "Treat attention as a resource to direct, not a reflex to surrender."],
  ["Digital Identity", "People increasingly construct versions of themselves across profiles, feeds, and communities.", "Self image, story, and interpretation influence how identity is expressed and reinforced.", "Be conscious of the narratives you build around yourself online and offline."],
  ["Remote Work", "Work is shaped by screens, asynchronous communication, and self management.", "Structure increasingly has to be generated internally rather than imposed externally.", "Inner discipline matters more when outer supervision decreases."],
  ["Information Overload", "The volume of available information now exceeds any person’s ability to process it fully.", "Mental filters determine which signals become meaning.", "Build deliberate filters before noise begins choosing your priorities for you."],
];

function Panel({ title, children, className = "" }) {
  return <section className={`hme-panel ${className}`}><h3>{title}</h3>{children}</section>;
}

function PrincipleStrip({ activePrinciple = 0 }) {
  return (
    <div className="hme-principles" aria-label="The seven Hermetic principles">
      {PRINCIPLES.map(([roman, name, Icon, accent], index) => (
        <button key={name} type="button" className={index === activePrinciple ? "is-active" : ""} style={{ "--principle-accent": accent }}>
          <span>{roman}</span><Icon size={27} /><strong>{name}</strong>
        </button>
      ))}
    </div>
  );
}

function IntroScreen() {
  return <div className="hme-editorial"><Panel title="Before the Body, the All Mind"><p className="hme-lede">Before an action becomes visible, a pattern of thought has already organized what can be noticed, believed, and chosen.</p><blockquote>Who was shaping your mind before you learned to shape it yourself?</blockquote></Panel><Panel title="Enter the Principle"><p>This module begins by separating thought from truth. Familiar ideas may feel personal while still being inherited, repeated, or reinforced by the environments around you.</p><p>The work is not to control every thought. It is to become conscious of which thoughts are directing you.</p></Panel></div>;
}

function PrincipleScreen() {
  return <div className="hme-split"><Panel title="The Law of Mentalism"><p className="hme-lede">The All is Mind; the Universe is Mental.</p><p>Everything begins in mind. Before any form, action, or experience, there is thought. Mind is the source and substance of all that exists.</p><p>Your outer world is shaped by the patterns through which you interpret, prioritize, and respond.</p><blockquote>Mind precedes matter. Master mind, and you master direction.</blockquote></Panel><Panel title="From Source to Reality" className="hme-flow"><div><Brain /><span>Thought</span></div><ArrowRight/><div><Eye/><span>Perception</span></div><ArrowRight/><div><Target/><span>Choice</span></div><ArrowRight/><div><Heart/><span>Behavior</span></div><ArrowRight/><div><Building2/><span>Reality</span></div></Panel></div>;
}

function KeyConceptsScreen() {
  const concepts = [
    ["Mind precedes form", "Every external structure begins as an internal pattern."],
    ["Perception organizes reality", "What you notice, name, and emphasize shapes your experience."],
    ["Repetition becomes belief", "Repeated thoughts harden into assumptions, habits, and identity."],
    ["Attention directs creation", "Energy follows focus. What you repeatedly feed gains power."],
  ];
  return <div className="hme-split"><Panel title="Key Concepts of Mentalism"><div className="hme-concept-list">{concepts.map(([title, body], i)=><article key={title}><span>{i+1}</span><div><h4>{title}</h4><p>{body}</p></div></article>)}</div></Panel><Panel title="The Creation Flow" className="hme-flow"><div><Brain/><span>Thought</span></div><ArrowRight/><div><Eye/><span>Attention</span></div><ArrowRight/><div><Heart/><span>Belief</span></div><ArrowRight/><div><Target/><span>Action</span></div><ArrowRight/><div><Building2/><span>Reality</span></div></Panel></div>;
}

function WhyItMattersScreen() {
  const reasons = [["It explains influence", "Beliefs are often inherited before they are examined."],["It restores agency", "Changing thought patterns changes what becomes possible."],["It clarifies patterns", "Recurring outcomes often begin as recurring inner assumptions."],["It grounds reclamation", "Transformation starts with reclaiming authorship of the mind."]];
  return <div className="hme-split"><Panel title="Why Mentalism Matters"><div className="hme-concept-list">{reasons.map(([title,body],i)=><article key={title}><span>{i+1}</span><div><h4>{title}</h4><p>{body}</p></div></article>)}</div></Panel><Panel title="Why This Changes Everything"><p className="hme-lede">Your inner world is not private. It becomes pattern, perception, behavior, and lived reality.</p><ul className="hme-checks"><li>It reveals where conditioning is steering your life.</li><li>It turns awareness into responsibility.</li><li>It makes inner work practical, not abstract.</li></ul><blockquote>You do not merely witness reality. You participate in shaping it.</blockquote></Panel></div>;
}

function DomainsScreen() {
  return <div className="hme-gallery">{DOMAIN_CARDS.map(([name,observation,pattern,why])=><article key={name}><h3>{name}</h3><dl><dt>Observation</dt><dd>{observation}</dd><dt>Pattern</dt><dd>{pattern}</dd><dt>Why it matters</dt><dd>{why}</dd></dl><button type="button">Expand <ChevronDown size={14}/></button></article>)}</div>;
}

function ReclamationScreen({ albumArtSrc, audioSrc }) {
  const [playing,setPlaying]=useState(false);
  return <div className="hme-reclamation"><div className="hme-album-column"><img src={albumArtSrc || "/images/reclamation-cover.jpg"} alt="Reclamation album artwork"/><div className="hme-player"><div><small>Now playing</small><strong>Reclamation</strong></div><button type="button" onClick={()=>setPlaying(!playing)}>{playing?<Pause/>:<Play/>}</button><div className="hme-scrub"><i><b style={{width:playing?"38%":"22%"}}/></i><span>01:37 / 04:12</span></div>{audioSrc && <audio src={audioSrc} preload="metadata"/>}</div></div><div className="hme-essay"><span>Featured song · Track 1</span><h2>Reclamation</h2><h3>Context</h3><p>Placed at the threshold of Act Three, the song re establishes authorship after the collapse of simulated control. The mind returns online. The system is no longer obeyed. It is observed.</p><h3>Lyric</h3><blockquote>“I came back through the static with my name still lit inside the code.”</blockquote><h3>Analysis</h3><p>The imagery of static, code, and light maps directly to Mentalism: the mind as origin and operator. Static represents imposed narratives. The name represents identity. The code represents the structure consciousness can examine and rewrite.</p><h3>Reclamation Insight</h3><p>Mentalism is not simply about having thoughts. It is about reclaiming the authority to name, frame, and direct experience.</p></div></div>;
}

function LensScreen() {
  return <div className="hme-gallery hme-modern">{MODERN_CARDS.map(([name,happening,connection,insight])=><article key={name}><div className="hme-topic-visual"><Globe2/></div><h3>{name}</h3><dl><dt>What’s happening?</dt><dd>{happening}</dd><dt>Hermetic connection</dt><dd>{connection}</dd><dt>Practical insight</dt><dd>{insight}</dd></dl></article>)}</div>;
}

function ReflectionScreen({ value, onChange }) {
  return <div className="hme-quiet"><span>Reflection</span><h2>What does this principle help you notice about the ways your inner world has been shaping your outer experience?</h2><ol><li>When have you experienced this principle without recognizing it?</li><li>What pattern in your life does this lesson help explain?</li><li>What challenged your assumptions?</li><li>What feels different after reading this lesson?</li></ol><textarea value={value} onChange={e=>onChange(e.target.value)} placeholder="Record your observations, thoughts, or emerging insight here..."/><blockquote>Understanding begins with observation. Change begins with practice.</blockquote></div>;
}

function ProtocolScreen({ values, onChange }) {
  const prompts=["What thought pattern am I noticing?","What story does it create?","How does it shape my behavior?","What alternative frame can I test?","What action can I choose next?"];
  return <div className="hme-protocol"><div><span>Protocol</span><h2>Narrative Audit</h2><p className="hme-lede">Identify how recurring thoughts shape perception, decisions, and lived experience so you can respond more intentionally.</p><div className="hme-two-up"><Panel title="When to use it"><ul><li>Before an important decision</li><li>When feeling stuck</li><li>During conflict or confusion</li><li>During a period of transition</li><li>As a weekly review practice</li></ul></Panel><Panel title="The process"><ol>{prompts.map((p,i)=><li key={p}><span>{i+1}</span>{p}</li>)}</ol></Panel></div><Panel title="Worked example"><p><strong>Pattern:</strong> “Nothing ever changes for me.”</p><p><strong>Shift:</strong> Change is possible, and small actions compound.</p><p><strong>Action:</strong> Take one aligned step today, then review and adjust.</p></Panel></div><Panel title="Personal workspace" className="hme-workspace">{prompts.map((p,i)=><label key={p}><span>{p}</span><textarea value={values[i]||""} onChange={e=>onChange(i,e.target.value)}/></label>)}</Panel></div>;
}

function ArtifactScreen({ artifact, onChange, onSave }) {
  const fields=["Core cycles","Expansion patterns","Contraction patterns","Recovery rhythms","Timing observations","System awareness"];
  return <div className="hme-artifact-builder"><header><div><span>Create your artifact</span><h2>The Rhythm Map</h2></div><button type="button" onClick={onSave}><Save size={16}/> Save draft</button></header><nav>{fields.map((field,i)=><button type="button" key={field} className={i===0?"is-active":""}><span>{i+1}</span>{field}</button>)}</nav><div className="hme-artifact-grid"><div><h3>1. Core cycles</h3><p>Identify the recurring cycles in the key areas of your life.</p>{["Energy","Creativity","Relationships","Finances","Physical health","Spiritual growth"].map(field=><label key={field}><span>{field}</span><textarea value={artifact[field]||""} onChange={e=>onChange(field,e.target.value)} placeholder="Type your observations..."/></label>)}</div><aside><Panel title="About this artifact"><p>The Rhythm Map is your personal reference for understanding the cycles that shape your life. It remains editable and grows with you.</p></Panel><Panel title="Tips for this section"><ul><li>Be honest, not perfect.</li><li>Observe, do not judge.</li><li>Look for patterns, not isolated events.</li><li>Include both highs and lows.</li></ul></Panel><button type="button"><Download size={16}/> Export artifact</button></aside></div></div>;
}

function SummaryScreen() {
  const insights=["Rhythm governs every system, from nature to human behavior.","Every cycle has a purpose. Expansion creates and contraction refines.","You can work with a cycle instead of fighting it.","Awareness reveals patterns, and patterns reveal choices."];
  return <div className="hme-summary"><div><Panel title="Principle recap"><p className="hme-lede">Everything moves in cycles. Nothing remains at a peak, and nothing remains at a low. Rhythm is not a flaw in the system. It is the system.</p></Panel><h3>Key insights</h3><div className="hme-insights">{insights.map((item,i)=><article key={item}><span>{i+1}</span><p>{item}</p></article>)}</div><div className="hme-big-idea"><Sparkles/><div><span>The big idea</span><h2>When you learn the pattern, you gain the power of timing.</h2></div></div></div><Panel title="Looking back"><ol className="hme-timeline"><li>You explored the principle.</li><li>You recognized it across domains.</li><li>You examined it through Reclamation.</li><li>You considered it in today’s world.</li><li>You reflected on your experience.</li><li>You practiced it.</li><li>You built your artifact.</li></ol><h4>Looking ahead</h4><p>Cause and Effect reveals how your choices within the rhythm create your reality.</p></Panel></div>;
}

export default function HermeticMaterialExperience({
  activePrinciple = 0,
  initialTab = "principle",
  albumArtSrc,
  audioSrc,
  progress = 48,
  onComplete,
}) {
  const [activeTab,setActiveTab]=useState(initialTab);
  const [reflection,setReflection]=useState("");
  const [protocol,setProtocol]=useState([]);
  const [artifact,setArtifact]=useState({});
  const activeIndex=TABS.findIndex(([id])=>id===activeTab);
  const next=TABS[Math.min(activeIndex+1,TABS.length-1)];
  const screen=useMemo(()=>{
    if(activeTab==="intro") return <IntroScreen/>;
    if(activeTab==="principle") return <PrincipleScreen/>;
    if(activeTab==="key-concepts") return <KeyConceptsScreen/>;
    if(activeTab==="why-it-matters") return <WhyItMattersScreen/>;
    if(activeTab==="domains") return <DomainsScreen/>;
    if(activeTab==="reclamation") return <ReclamationScreen albumArtSrc={albumArtSrc} audioSrc={audioSrc}/>;
    if(activeTab==="2026-lens") return <LensScreen/>;
    if(activeTab==="reflection") return <ReflectionScreen value={reflection} onChange={setReflection}/>;
    if(activeTab==="protocol") return <ProtocolScreen values={protocol} onChange={(i,v)=>setProtocol(current=>{const next=[...current];next[i]=v;return next;})}/>;
    if(activeTab==="artifact") return <ArtifactScreen artifact={artifact} onChange={(k,v)=>setArtifact(current=>({...current,[k]:v}))} onSave={()=>localStorage.setItem("ru-rhythm-map",JSON.stringify(artifact))}/>;
    return <SummaryScreen/>;
  },[activeTab,albumArtSrc,audioSrc,artifact,protocol,reflection]);
  return <main className="hme-root"><header className="hme-header"><div className="hme-brand"><span>RU</span><div><strong>Reclamation University</strong><small>Hermetic Hall</small></div></div><div className="hme-progress"><span>Your progress</span><i><b style={{width:`${progress}%`}}/></i><strong>{progress}%</strong></div></header><div className="hme-shell"><aside className="hme-tabs">{TABS.map(([id,label,Icon])=><button type="button" key={id} className={id===activeTab?"is-active":""} onClick={()=>setActiveTab(id)}><Icon size={18}/><span>{label}</span></button>)}</aside><section className="hme-main"><PrincipleStrip activePrinciple={activePrinciple}/><header className="hme-lesson-title"><span>I</span><div><h1>Mentalism</h1><p>Before the Body, the All Mind.</p></div></header><div className="hme-screen">{screen}</div><footer className="hme-footer"><div><small>Principle I of VII</small><strong>Mentalism</strong></div>{activeTab!=="summary"?<button type="button" onClick={()=>setActiveTab(next[0])}>Continue to {next[1]} <ArrowRight size={17}/></button>:<button type="button" onClick={onComplete}>Complete module <ArrowRight size={17}/></button>}</footer></section></div></main>;
}
