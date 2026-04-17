import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const phaseLabels = [
  { name: 'Recognition', desc: 'Where are you right now?' },
  { name: 'Excavation', desc: 'What pattern keeps appearing?' },
  { name: 'Specificity', desc: 'Where does it come from?' },
  { name: 'Claiming', desc: 'Name it in your own words.' },
  { name: 'Declaration', desc: 'What do you choose going forward?' },
];

const actElements = { 1: 'Earth', 2: 'Fire', 3: 'Water', 4: 'Air' };
const actNames = { 1: 'The Fractured Veil', 2: 'The Reflection Chamber', 3: 'Reclamation', 4: 'The Crucible Code' };
const actColors = { 1: 'var(--g3)', 2: 'var(--b3)', 3: 'var(--r3)', 4: 'var(--y3)' };

const ProtocolChat = ({ act = 1 }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [phase, setPhase] = useState(0);
  const [scores, setScores] = useState({ depth: 0, clarity: 0, ownership: 0 });
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await axios.get('/protocol/sessions');
      setSessions(res.data.sessions || []);
    } catch (e) { /* ignore */ }
  };

  const loadSession = async (sid) => {
    try {
      const res = await axios.get(`/protocol/sessions/${sid}`);
      const s = res.data;
      setSessionId(s.session_id);
      setPhase(s.phase || 0);
      setScores(s.scores || { depth: 0, clarity: 0, ownership: 0 });
      setMessages(s.messages || []);
      setShowSessions(false);
    } catch (e) { /* ignore */ }
  };

  const startNewSession = () => {
    setSessionId(null);
    setMessages([]);
    setPhase(0);
    setScores({ depth: 0, clarity: 0, ownership: 0 });
    setShowSessions(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);

    setMessages(prev => [...prev, { role: 'user', content: text }]);

    try {
      const res = await axios.post('/protocol/chat', {
        message: text,
        session_id: sessionId,
        act
      });
      setSessionId(res.data.session_id);
      setPhase(res.data.phase || 0);
      setScores(res.data.scores || scores);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (e) {
      const detail = e.response?.data?.detail || '';
      const errorMsg = detail.includes('budget') || detail.includes('Budget')
        ? 'The Seeker needs fuel. Go to Profile > Universal Key > Add Balance to continue.'
        : 'The signal dropped. Try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const mastery = scores.depth >= 7 && scores.clarity >= 7 && scores.ownership >= 7;
  const avgScore = Math.round(((scores.depth || 0) + (scores.clarity || 0) + (scores.ownership || 0)) / 3);

  return (
    <div data-testid="protocol-chat" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--void)' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Protocol Engine · Act {['I','II','III','IV'][act - 1]} · {actElements[act]}
          </div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, fontWeight: 600, color: actColors[act], letterSpacing: '0.06em', marginTop: 2 }}>
            The Seeker Guides
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setShowSessions(!showSessions)} data-testid="toggle-sessions"
            style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>
            Sessions
          </button>
          <button onClick={startNewSession} data-testid="new-session-btn"
            style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', padding: '4px 10px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer' }}>
            New
          </button>
        </div>
      </div>

      {/* Phase Progress */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 2, flexShrink: 0 }}>
        {phaseLabels.map((p, i) => (
          <div key={i} style={{
            flex: 1, padding: '4px 8px', textAlign: 'center',
            background: i === phase ? 'rgba(90,176,56,0.08)' : i < phase ? 'rgba(90,176,56,0.03)' : 'transparent',
            borderBottom: i === phase ? '2px solid var(--act)' : i < phase ? '2px solid var(--g2)' : '2px solid var(--border)'
          }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', color: i <= phase ? 'var(--act)' : 'var(--muted)' }}>
              {p.name}
            </div>
          </div>
        ))}
      </div>

      {/* Sessions Drawer */}
      {showSessions && (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)', maxHeight: 120, overflowY: 'auto', background: 'var(--surface)' }}>
          {sessions.length === 0 ? (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'var(--muted)', padding: 8 }}>No previous sessions</div>
          ) : sessions.map(s => (
            <div key={s.session_id} onClick={() => loadSession(s.session_id)}
              style={{ padding: '6px 8px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
              <span style={{ color: 'var(--white)' }}>Act {['I','II','III','IV'][s.act - 1]} · Phase {s.phase}</span>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)' }}>{s.updated_at?.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: 36, color: 'var(--act)', opacity: 0.3, marginBottom: 16 }}>&#x25C8;</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: 'var(--white)', marginBottom: 8, letterSpacing: '0.06em' }}>
              Begin Your Protocol Session
            </div>
            <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 400, margin: '0 auto 20px' }}>
              The Seeker will guide you through a structured reflection process. Share what you're comfortable with — use general terms like "my situation" or "the pattern I recognize."
            </div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--act)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid var(--g2)', display: 'inline-block' }}>
              Your privacy is protected. No specifics required.
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12, animation: 'fadeUp 0.3s ease both'
          }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px',
              background: msg.role === 'user' ? 'rgba(90,176,56,0.06)' : 'var(--panel)',
              border: `1px solid ${msg.role === 'user' ? 'var(--g2)' : 'var(--border)'}`,
              borderLeft: msg.role === 'assistant' ? '3px solid var(--act)' : undefined
            }}>
              {msg.role === 'assistant' && (
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.25em', color: 'var(--act)', marginBottom: 4, textTransform: 'uppercase' }}>
                  The Seeker
                </div>
              )}
              <div style={{
                fontSize: msg.role === 'assistant' ? 13 : 14,
                fontFamily: msg.role === 'assistant' ? "'IM Fell English',serif" : "'Rajdhani',sans-serif",
                fontStyle: msg.role === 'assistant' ? 'italic' : 'normal',
                color: msg.role === 'user' ? 'var(--white)' : 'rgba(232,228,216,0.8)',
                lineHeight: 1.65, whiteSpace: 'pre-wrap'
              }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {sending && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{ padding: '10px 14px', background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: '3px solid var(--act)' }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--act)', letterSpacing: '0.15em', animation: 'pulse 1.5s ease-in-out infinite' }}>
                The Seeker is reflecting...
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Scores bar */}
      {messages.length > 0 && (
        <div style={{ padding: '6px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16, justifyContent: 'center', flexShrink: 0 }}>
          {[
            { label: 'Depth', val: scores.depth },
            { label: 'Clarity', val: scores.clarity },
            { label: 'Ownership', val: scores.ownership },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: s.val >= 7 ? 'var(--act)' : 'var(--muted)' }}>{s.val}/10</div>
            </div>
          ))}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>Phase</div>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'var(--act)' }}>{phase}/4</div>
          </div>
          {mastery && (
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--y3)', letterSpacing: '0.2em', alignSelf: 'center', padding: '2px 8px', border: '1px solid var(--y2)' }}>
              Mastery
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          data-testid="protocol-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak to The Seeker... (Enter to send)"
          rows={2}
          style={{
            flex: 1, background: 'var(--panel)', border: '1px solid var(--border)',
            padding: '10px 14px', fontSize: 13, color: 'var(--white)',
            fontFamily: "'Rajdhani',sans-serif", outline: 'none', resize: 'none',
            lineHeight: 1.5
          }}
        />
        <button
          data-testid="send-btn"
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          style={{
            width: 48, border: '1px solid var(--act)', background: 'transparent',
            color: 'var(--act)', cursor: !input.trim() || sending ? 'not-allowed' : 'pointer',
            fontSize: 16, fontFamily: "'Share Tech Mono',monospace",
            opacity: !input.trim() || sending ? 0.3 : 1
          }}
        >
          &#x27F6;
        </button>
      </div>
    </div>
  );
};

export default ProtocolChat;
