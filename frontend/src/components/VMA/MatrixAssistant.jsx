import { useMemo, useState } from "react";
import {
  ArrowsClockwise,
  Brain,
  Circuitry,
  Command,
  Database,
  Microphone,
  PaperPlaneTilt,
  Pulse,
  Scan,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  Target,
  Waveform,
} from "@phosphor-icons/react";

import AssistantLighting from "./AssistantLighting";
import AvatarScene from "./AvatarScene";
import ProtocolParticles from "./ProtocolParticles";
import vmaEmblem from "../../public/emblems/vma_emblem.png";
import "./MatrixAssistant.css";

const assistantModes = [
  {
    id: "orient",
    label: "Orient",
    icon: Scan,
    response: "Orientation matrix is aligned. I can map the active protocol, next action, and archived signals.",
  },
  {
    id: "analyze",
    label: "Analyze",
    icon: Brain,
    response: "Analysis layer is active. I will isolate pattern, friction, and leverage points from the current input.",
  },
  {
    id: "execute",
    label: "Execute",
    icon: Command,
    response: "Execution queue is armed. I can translate the signal into a direct operating sequence.",
  },
];

const coreStats = [
  { label: "Matrix Link", value: "97%", tone: "red" },
  { label: "Signal Depth", value: "04", tone: "cyan" },
  { label: "Protocol Sync", value: "Live", tone: "gold" },
];

const intelligencePanels = [
  {
    label: "Cognitive Mesh",
    value: "Pattern recognition, recall, and protocol routing are held in the active VMA shell.",
    icon: Circuitry,
  },
  {
    label: "Memory Vault",
    value: "Session context is staged for retrieval before each response cycle.",
    icon: Database,
  },
  {
    label: "Integrity Gate",
    value: "The assistant chamber keeps user prompts, module state, and system signals visually separated.",
    icon: ShieldCheck,
  },
];

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "VMA shell online. Route your signal through the matrix and I will return a focused operating readout.",
  },
  {
    id: 2,
    role: "system",
    text: "Containment field stable. Agent channel waiting for command input.",
  },
];

export default function MatrixAssistant() {
  const [activeModeId, setActiveModeId] = useState("orient");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [voicePrimed, setVoicePrimed] = useState(false);

  const activeMode = useMemo(
    () => assistantModes.find((mode) => mode.id === activeModeId) || assistantModes[0],
    [activeModeId],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        text: cleanPrompt,
      },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: `${activeMode.response} Captured signal: "${cleanPrompt}"`,
      },
    ]);
    setPrompt("");
  };

  const handleReset = () => {
    setMessages(initialMessages);
    setPrompt("");
    setVoicePrimed(false);
  };

  return (
    <main className="vma-module" data-testid="vma-module">
      <section className="vma-hero" aria-labelledby="vma-title">
        <div className="vma-hero-copy">
          <div className="vma-kicker">
            <span className="vma-kicker-line" />
            <span>Virtual Matrix Assistant</span>
          </div>
          <h1 id="vma-title">VMA</h1>
          <p>
            A contained digital agent chamber for routing questions, decoding protocol context,
            and returning a clean operational readout.
          </p>
        </div>

        <div className="vma-identity-mark" aria-label="VMA emblem">
          <img src={vmaEmblem} alt="" aria-hidden="true" />
          <div>
            <span>Agent Class</span>
            <strong>Matrix Interface</strong>
          </div>
        </div>
      </section>

      <section className="vma-workspace" aria-label="VMA command workspace">
        <div className="vma-agent-panel">
          <div className="vma-panel-header">
            <div>
              <span>Agent Containment</span>
              <strong>Digital shell active</strong>
            </div>
            <Pulse size={24} weight="duotone" />
          </div>

          <div className="vma-agent-container" data-testid="vma-agent-container">
            <AssistantLighting />
            <ProtocolParticles />
            <AvatarScene mode={activeMode.label} voicePrimed={voicePrimed} />
            <div className="vma-holo-card vma-holo-card-primary">
              <span>Core</span>
              <strong>{activeMode.label}</strong>
            </div>
            <div className="vma-holo-card vma-holo-card-secondary">
              <span>Channel</span>
              <strong>{voicePrimed ? "Voice Hot" : "Text Ready"}</strong>
            </div>
          </div>

          <div className="vma-stat-grid">
            {coreStats.map((stat) => (
              <div className={`vma-stat is-${stat.tone}`} key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="vma-console-panel">
          <div className="vma-panel-header">
            <div>
              <span>Command Console</span>
              <strong>{activeMode.label} mode</strong>
            </div>
            <SlidersHorizontal size={24} weight="duotone" />
          </div>

          <div className="vma-mode-strip" role="tablist" aria-label="Assistant mode">
            {assistantModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode.id === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  className={isActive ? "is-active" : ""}
                  onClick={() => setActiveModeId(mode.id)}
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`vma-mode-${mode.id}`}
                >
                  <Icon size={16} weight="duotone" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          <div className="vma-message-log" aria-live="polite" data-testid="vma-message-log">
            {messages.map((message) => (
              <article className={`vma-message is-${message.role}`} key={message.id}>
                <span>{message.role === "user" ? "Seeker" : message.role === "system" ? "System" : "VMA"}</span>
                <p>{message.text}</p>
              </article>
            ))}
          </div>

          <form className="vma-command-form" onSubmit={handleSubmit}>
            <label htmlFor="vma-command-input">Command input</label>
            <div>
              <input
                id="vma-command-input"
                data-testid="vma-command-input"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Transmit a request to the VMA"
              />
              <button
                type="button"
                className={voicePrimed ? "is-active" : ""}
                onClick={() => setVoicePrimed((current) => !current)}
                aria-label={voicePrimed ? "Disable voice channel" : "Prime voice channel"}
                data-testid="vma-voice-toggle"
              >
                <Microphone size={18} weight="duotone" />
              </button>
              <button type="submit" aria-label="Send command" data-testid="vma-send-command">
                <PaperPlaneTilt size={18} weight="fill" />
              </button>
            </div>
          </form>

          <button type="button" className="vma-reset-button" onClick={handleReset} data-testid="vma-reset">
            <ArrowsClockwise size={14} weight="bold" />
            <span>Recalibrate</span>
          </button>
        </div>
      </section>

      <section className="vma-intelligence-grid" aria-label="Assistant architecture">
        {intelligencePanels.map((panel) => {
          const Icon = panel.icon;
          return (
            <article key={panel.label}>
              <Icon size={26} weight="duotone" />
              <div>
                <span>{panel.label}</span>
                <p>{panel.value}</p>
              </div>
            </article>
          );
        })}
        <article className="vma-priority-panel">
          <Target size={26} weight="duotone" />
          <div>
            <span>Priority Signal</span>
            <p>Keep the assistant embodied in a visible containment system, with the VMA emblem as the dominant identity mark.</p>
          </div>
        </article>
        <article className="vma-priority-panel">
          <Waveform size={26} weight="duotone" />
          <div>
            <span>Response Layer</span>
            <p>The console is staged for text first, with a voice-state switch ready for future integration.</p>
          </div>
        </article>
        <article className="vma-priority-panel">
          <Sparkle size={26} weight="duotone" />
          <div>
            <span>Visual Language</span>
            <p>Red crystal energy, matte black steel, cyan holographics, and hairline terminal controls.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
