import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TABS = [
  { id: 'tracks', label: 'Audio Bank', icon: '\u266B' },
  { id: 'content', label: 'Track Content', icon: '\u2726' },
  { id: 'wheel', label: 'Wheel Config', icon: '\u25CE' },
  { id: 'keys', label: 'License Keys', icon: '\u2737' },
  { id: 'users', label: 'Users', icon: '\u2302' },
  { id: 'settings', label: 'Settings', icon: '\u2699' },
  { id: 'guide', label: 'Setup Guide', icon: '\u2139' },
];

const ACT_OPTIONS = [
  { value: 1, label: 'Act I · Earth', color: '#5ab038' },
  { value: 2, label: 'Act II · Fire', color: '#d03010' },
  { value: 3, label: 'Act III · Water', color: '#50a0e0' },
  { value: 0, label: 'Bonus Track', color: '#c8a020' },
];

// ==================== TRACKS TAB ====================
const TracksTab = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingTrack, setEditingTrack] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploading, setUploading] = useState(null);
  const [newTrack, setNewTrack] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', act: 1, type: 'track', color: '#5ab038', lyrics: '' });
  const fileRef = useRef(null);

  const fetchTracks = async () => {
    try {
      const res = await axios.get('/admin/tracks');
      setTracks(res.data.tracks || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchTracks(); }, []);

  const handleUploadAudio = async (trackId, file) => {
    setUploading(trackId);
    try {
      const form = new FormData();
      form.append('file', file);
      await axios.post(`/admin/tracks/${trackId}/audio`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
      await fetchTracks();
    } catch (e) {
      alert('Upload failed: ' + (e.response?.data?.detail || e.message));
    }
    setUploading(null);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`/admin/tracks/${editingTrack}`, editForm);
      setEditingTrack(null);
      await fetchTracks();
    } catch (e) { alert('Save failed'); }
  };

  const handleCreateTrack = async () => {
    try {
      await axios.post('/admin/tracks', newForm);
      setNewTrack(false);
      setNewForm({ name: '', act: 1, type: 'track', color: '#5ab038', lyrics: '' });
      await fetchTracks();
    } catch (e) { alert('Create failed'); }
  };

  const handleDeleteTrack = async (trackId) => {
    if (!window.confirm('Delete this track?')) return;
    try {
      await axios.delete(`/admin/tracks/${trackId}`);
      await fetchTracks();
    } catch (e) { alert('Delete failed'); }
  };

  const filtered = filter === 'all' ? tracks : tracks.filter(t =>
    filter === 'bonus' ? t.act === 0 : t.act === parseInt(filter)
  );

  if (loading) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading tracks...</div>;

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {[{ v: 'all', l: 'All' }, { v: '1', l: 'Act I' }, { v: '2', l: 'Act II' }, { v: '3', l: 'Act III' }, { v: 'bonus', l: 'Bonus' }].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} style={{
            padding: '6px 14px', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em',
            textTransform: 'uppercase', border: `1px solid ${filter === f.v ? 'var(--act)' : 'var(--border)'}`,
            background: filter === f.v ? 'rgba(90,176,56,0.1)' : 'transparent',
            color: filter === f.v ? 'var(--act)' : 'var(--muted)', cursor: 'pointer'
          }}>
            {f.l}
          </button>
        ))}
        <button onClick={() => setNewTrack(true)} style={{
          marginLeft: 'auto', padding: '6px 14px', fontFamily: "'Share Tech Mono',monospace", fontSize: 8,
          letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid var(--act)',
          background: 'transparent', color: 'var(--act)', cursor: 'pointer'
        }}>
          + Add Track
        </button>
      </div>

      {/* New track form */}
      {newTrack && (
        <div data-testid="new-track-form" style={{ background: 'var(--panel)', border: '1px solid var(--act)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', color: 'var(--act)', marginBottom: 12, textTransform: 'uppercase' }}>New Track</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 120px', gap: 8, marginBottom: 8 }}>
            <input value={newForm.name} onChange={e => setNewForm(p => ({ ...p, name: e.target.value }))} placeholder="Track name"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 13, outline: 'none' }} />
            <select value={newForm.act} onChange={e => setNewForm(p => ({ ...p, act: parseInt(e.target.value), color: ACT_OPTIONS.find(a => a.value === parseInt(e.target.value))?.color || '#5ab038' }))}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 12, outline: 'none' }}>
              {ACT_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
            <select value={newForm.type} onChange={e => setNewForm(p => ({ ...p, type: e.target.value }))}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 12, outline: 'none' }}>
              <option value="track">Album Track</option>
              <option value="bonus">Bonus Track</option>
            </select>
          </div>
          <textarea value={newForm.lyrics} onChange={e => setNewForm(p => ({ ...p, lyrics: e.target.value }))} placeholder="Lyrics (optional)"
            rows={3} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 12, outline: 'none', resize: 'vertical', marginBottom: 8 }} />
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={handleCreateTrack} style={{ padding: '6px 16px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em' }}>Create</button>
            <button onClick={() => setNewTrack(false)} style={{ padding: '6px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Track list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {filtered.map(track => (
          <div key={track.track_id} data-testid={`track-row-${track.track_id}`} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 32, background: track.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              {editingTrack === track.track_id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                      style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 8px', color: 'var(--white)', fontSize: 13, outline: 'none' }} />
                    <select value={editForm.act ?? track.act} onChange={e => setEditForm(p => ({ ...p, act: parseInt(e.target.value) }))}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 8px', color: 'var(--white)', fontSize: 11, outline: 'none' }}>
                      {ACT_OPTIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                    </select>
                  </div>
                  <textarea value={editForm.lyrics ?? ''} onChange={e => setEditForm(p => ({ ...p, lyrics: e.target.value }))} placeholder="Lyrics"
                    rows={3} style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 8px', color: 'var(--white)', fontSize: 11, outline: 'none', resize: 'vertical' }} />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={handleSaveEdit} style={{ padding: '4px 12px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8 }}>Save</button>
                    <button onClick={() => setEditingTrack(null)} style={{ padding: '4px 12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--white)', marginBottom: 2 }}>{track.name}</div>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.15em', color: 'var(--muted)' }}>
                    {track.act === 0 ? 'Bonus' : `Act ${['I', 'II', 'III'][track.act - 1]}`} · {track.type} · {track.audio_filename ? track.audio_filename : 'No audio'}
                  </div>
                </>
              )}
            </div>
            {/* Audio status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {track.audio_filename ? (
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--act)', letterSpacing: '0.1em' }}>
                  &#x2713; Audio
                </span>
              ) : (
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--r3)', letterSpacing: '0.1em' }}>
                  No Audio
                </span>
              )}
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              <input type="file" ref={fileRef} accept="audio/*" style={{ display: 'none' }}
                onChange={e => { if (e.target.files[0]) handleUploadAudio(track.track_id, e.target.files[0]); }} />
              <button onClick={() => { fileRef.current?.click(); }}
                disabled={uploading === track.track_id}
                data-testid={`upload-btn-${track.track_id}`}
                style={{
                  padding: '4px 10px', border: '1px solid var(--act)', background: 'transparent',
                  color: 'var(--act)', cursor: uploading === track.track_id ? 'wait' : 'pointer',
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em', textTransform: 'uppercase'
                }}>
                {uploading === track.track_id ? 'Uploading...' : 'Upload'}
              </button>
              <button onClick={() => { setEditingTrack(track.track_id); setEditForm({ name: track.name, act: track.act, lyrics: track.lyrics || '' }); }}
                style={{ padding: '4px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em' }}>
                Edit
              </button>
              <button onClick={() => handleDeleteTrack(track.track_id)}
                style={{ padding: '4px 10px', border: '1px solid var(--r2)', background: 'transparent', color: 'var(--r3)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em' }}>
                Del
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.15em' }}>
        {filtered.length} tracks · {tracks.filter(t => t.audio_filename).length} with audio
      </div>
    </div>
  );
};

// ==================== LICENSE KEYS TAB ====================
const KeysTab = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState('');

  const fetchKeys = async () => {
    try {
      const res = await axios.get('/admin/license-keys');
      setKeys(res.data.keys || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreate = async () => {
    try {
      await axios.post('/admin/license-keys', { key: newKey || undefined });
      setNewKey('');
      await fetchKeys();
    } catch (e) { alert('Create failed'); }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete key ${key}?`)) return;
    try {
      await axios.delete(`/admin/license-keys/${key}`);
      await fetchKeys();
    } catch (e) { alert('Delete failed'); }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading keys...</div>;

  return (
    <div>
      {/* Create key */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        <input value={newKey} onChange={e => setNewKey(e.target.value.toUpperCase())} placeholder="Custom key (or leave blank for auto-generated)"
          data-testid="new-key-input"
          style={{ flex: 1, background: 'var(--panel)', border: '1px solid var(--border)', padding: '8px 12px', color: 'var(--white)', fontSize: 12, outline: 'none', fontFamily: "'Share Tech Mono',monospace", letterSpacing: '0.15em' }} />
        <button onClick={handleCreate} data-testid="create-key-btn"
          style={{ padding: '8px 20px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Generate Key
        </button>
      </div>

      {/* Keys list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {keys.map(k => (
          <div key={k.key} data-testid={`key-row-${k.key}`} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 14, color: k.used ? 'var(--muted)' : 'var(--act)', letterSpacing: '0.15em' }}>
                {k.key}
              </div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.1em', marginTop: 2 }}>
                {k.used ? `Used by ${k.used_by || 'unknown'} · ${k.used_at || ''}` : 'Available'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.15em',
                padding: '3px 8px', border: `1px solid ${k.used ? 'var(--r2)' : 'var(--g2)'}`,
                color: k.used ? 'var(--r3)' : 'var(--g3)'
              }}>
                {k.used ? 'Used' : 'Active'}
              </span>
              <button onClick={() => handleDelete(k.key)}
                style={{ padding: '3px 8px', border: '1px solid var(--r2)', background: 'transparent', color: 'var(--r3)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 7 }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)' }}>
        {keys.length} keys · {keys.filter(k => !k.used).length} available · {keys.filter(k => k.used).length} used
      </div>
    </div>
  );
};

// ==================== USERS TAB ====================
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleField = async (userId, field, currentVal) => {
    try {
      await axios.put(`/admin/users/${userId}`, { [field]: !currentVal });
      await fetchUsers();
    } catch (e) { alert('Update failed'); }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {users.map(u => (
          <div key={u.user_id} data-testid={`user-row-${u.user_id}`} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--white)' }}>{u.name || u.email}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)', letterSpacing: '0.1em', marginTop: 2 }}>
                {u.email} · Level {u.level || 1} · Act {u.current_act || 1}
              </div>
            </div>
            <button onClick={() => toggleField(u.user_id, 'act3_unlocked', u.act3_unlocked)}
              style={{
                padding: '4px 10px', border: `1px solid ${u.act3_unlocked ? 'var(--g2)' : 'var(--r2)'}`,
                background: 'transparent', color: u.act3_unlocked ? 'var(--g3)' : 'var(--r3)',
                cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.1em'
              }}>
              {u.act3_unlocked ? 'Unlocked' : 'Locked'}
            </button>
            <button onClick={() => toggleField(u.user_id, 'is_admin', u.is_admin)}
              style={{
                padding: '4px 10px', border: `1px solid ${u.is_admin ? 'var(--y2)' : 'var(--border)'}`,
                background: 'transparent', color: u.is_admin ? 'var(--y3)' : 'var(--muted)',
                cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.1em'
              }}>
              {u.is_admin ? 'Admin' : 'User'}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--muted)' }}>
        {users.length} users · {users.filter(u => u.is_admin).length} admins · {users.filter(u => u.act3_unlocked).length} unlocked
      </div>
    </div>
  );
};


// ==================== CONTENT TAB (Guided Listening) ====================
const ContentTab = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => { fetchTracks(); }, []);

  const fetchTracks = async () => {
    try {
      const res = await axios.get('/admin/tracks');
      setTracks((res.data.tracks || []).filter(t => t.type === 'track'));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const startEdit = (track) => {
    setEditing(track.track_id);
    setForm({
      lore: track.lore || '',
      lightcodes: track.lightcodes || '',
      shadowcodes: track.shadowcodes || '',
      system_role: track.system_role || '',
      spotify_uri: track.spotify_uri || ''
    });
  };

  const saveContent = async () => {
    try {
      await axios.put(`/admin/tracks/${editing}`, form);
      setEditing(null);
      await fetchTracks();
    } catch (e) { alert('Save failed'); }
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 12, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
        Add lightcodes, shadowcodes, backstory, system role, and Spotify URI for each track. This content appears in the Guided Listening Experience.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {tracks.map(track => (
          <div key={track.track_id} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editing === track.track_id ? 12 : 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 4, height: 20, background: track.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--white)' }}>{track.name}</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: 'var(--muted)', letterSpacing: '0.1em' }}>
                    Act {['I','II','III'][track.act - 1]}
                  </span>
                </div>
                {editing !== track.track_id && (
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, color: 'var(--muted)', marginTop: 2, paddingLeft: 12, letterSpacing: '0.1em' }}>
                    {track.lore ? '\u2713 Lore' : '\u2717 Lore'} · {track.lightcodes ? '\u2713 Lightcodes' : '\u2717 Lightcodes'} · {track.shadowcodes ? '\u2713 Shadowcodes' : '\u2717 Shadowcodes'} · {track.spotify_uri ? '\u2713 Spotify' : '\u2717 Spotify'}
                  </div>
                )}
              </div>
              {editing !== track.track_id && (
                <button onClick={() => startEdit(track)} style={{
                  fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.15em',
                  padding: '4px 10px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer'
                }}>Edit Content</button>
              )}
            </div>

            {editing === track.track_id && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FieldInput label="Spotify URI" placeholder="spotify:track:xxxxx" value={form.spotify_uri} onChange={v => setForm(p => ({ ...p, spotify_uri: v }))} mono />
                <FieldArea label="Backstory / Lore" placeholder="The origin and backstory of this track..." value={form.lore} onChange={v => setForm(p => ({ ...p, lore: v }))} />
                <FieldArea label="Lightcodes" placeholder="The positive transmissions embedded in this track..." value={form.lightcodes} onChange={v => setForm(p => ({ ...p, lightcodes: v }))} />
                <FieldArea label="Shadowcodes" placeholder="The shadow patterns this track illuminates..." value={form.shadowcodes} onChange={v => setForm(p => ({ ...p, shadowcodes: v }))} />
                <FieldArea label="System Role" placeholder="How this track contributes to the overall protocol..." value={form.system_role} onChange={v => setForm(p => ({ ...p, system_role: v }))} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={saveContent} style={{ padding: '6px 16px', border: '1px solid var(--act)', background: 'transparent', color: 'var(--act)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8 }}>Save</button>
                  <button onClick={() => setEditing(null)} style={{ padding: '6px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontFamily: "'Share Tech Mono',monospace", fontSize: 8 }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FieldInput = ({ label, placeholder, value, onChange, mono }) => (
  <div>
    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 11, outline: 'none', fontFamily: mono ? "'Share Tech Mono',monospace" : 'inherit', letterSpacing: mono ? '0.1em' : 'normal' }} />
  </div>
);

const FieldArea = ({ label, placeholder, value, onChange }) => (
  <div>
    <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 7, letterSpacing: '0.2em', color: 'var(--muted)', marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
    <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
      style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', padding: '6px 10px', color: 'var(--white)', fontSize: 11, outline: 'none', resize: 'vertical', lineHeight: 1.5 }} />
  </div>
);

// ==================== WHEEL CONFIG TAB ====================
const WheelConfigTab = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTracks(); }, []);

  const fetchTracks = async () => {
    try {
      const res = await axios.get('/admin/tracks');
      setTracks((res.data.tracks || []).filter(t => t.type === 'bonus'));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 24, color: 'var(--muted)' }}>Loading...</div>;

  return (
    <div>
      <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 12, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
        The Wheel shows 12 bonus tracks. Manage them in the Audio Bank tab (type: Bonus Track). The wheel automatically pulls the first 12 bonus tracks. To change wheel content, edit bonus tracks in the Audio Bank.
      </div>
      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.15em', color: 'var(--act)', marginBottom: 12 }}>
        Current wheel tracks ({tracks.length} bonus tracks):
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {tracks.slice(0, 12).map((t, i) => (
          <div key={t.track_id} style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'var(--muted)', width: 20, flexShrink: 0 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span style={{ fontSize: 12, color: 'var(--white)' }}>{t.name}</span>
          </div>
        ))}
      </div>
      {tracks.length < 12 && (
        <div style={{ marginTop: 12, fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--r3)', letterSpacing: '0.1em' }}>
          Need {12 - tracks.length} more bonus tracks. Add them in the Audio Bank tab with type "Bonus Track".
        </div>
      )}
    </div>
  );
};


// ==================== GUIDE TAB ====================
const SettingsTab = () => {
  const [settings, setSettings] = useState({ addon_price: 5.00 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get('/admin/settings').then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put('/admin/settings', settings);
      alert('Settings saved');
    } catch (e) { alert('Error saving'); }
    setSaving(false);
  };

  return (
    <div>
      <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: 16, color: 'var(--act)', marginBottom: 16 }}>App Settings</h3>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 20, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Pricing & Access Tiers
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: 14 }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--g3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Full Access (Stripe)</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: 'var(--white)' }}>$29.99</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>All 4 Acts + Streaming + Ownership of all digital files</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', padding: 14 }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, color: 'var(--b3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>License Key</div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: 'var(--white)' }}>$17.99</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>All 4 Acts + Streaming + Act III album ownership</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Album Ownership Add-On Price (for $17.99 license key users)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: 'var(--white)' }}>$</span>
            <input
              data-testid="addon-price-input"
              type="number"
              step="0.01"
              min="0"
              value={settings.addon_price || ''}
              onChange={e => setSettings({ ...settings, addon_price: parseFloat(e.target.value) || 0 })}
              style={{ width: 100, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)', padding: '8px 12px', color: 'var(--white)', fontFamily: "'Share Tech Mono',monospace", fontSize: 14 }}
            />
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>per album · upgrade to full ownership</span>
          </div>
        </div>

        <button data-testid="save-settings-btn" onClick={save} disabled={saving} style={{
          fontFamily: "'Share Tech Mono',monospace", fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          padding: '8px 24px', border: '1px solid var(--act)', background: 'transparent',
          color: 'var(--act)', cursor: 'pointer'
        }}>
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', padding: 20 }}>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12 }}>
          Access Summary
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid var(--border)' }}>Feature</th>
              <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid var(--border)' }}>Free</th>
              <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid var(--border)' }}>$17.99</th>
              <th style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid var(--border)' }}>$29.99</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--muted)' }}>
            {[
              ['Act I Protocol', true, true, true],
              ['Acts II-IV Protocol', false, true, true],
              ['Stream all 4 albums', false, true, true],
              ['Own Act III album', false, true, true],
              ['Own ALL albums', false, 'Add-on', true],
            ].map(([feat, free, lic, full], i) => (
              <tr key={i}>
                <td style={{ padding: 8, borderBottom: '1px solid rgba(232,228,216,0.06)' }}>{feat}</td>
                {[free, lic, full].map((v, j) => (
                  <td key={j} style={{ textAlign: 'center', padding: 8, borderBottom: '1px solid rgba(232,228,216,0.06)', color: v === true ? 'var(--g3)' : v === false ? 'var(--r3)' : 'var(--y3)' }}>
                    {v === true ? '\u2713' : v === false ? '\u2717' : v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const GuideTab = () => (
  <div style={{ maxWidth: 700 }}>
    <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, fontWeight: 600, color: 'var(--act)', marginBottom: 20, letterSpacing: '0.08em' }}>
      Admin Setup Guide
    </div>

    <Section title="1. Managing Audio Tracks" color="var(--g3)">
      <Step n="1">Go to the <b>Audio Bank</b> tab above</Step>
      <Step n="2">Each track is listed with its Act assignment and audio status</Step>
      <Step n="3">Click <b>Upload</b> next to any track to add an audio file (MP3, WAV, etc.)</Step>
      <Step n="4">Click <b>Edit</b> to change the track name, assigned Act, or lyrics</Step>
      <Step n="5">Click <b>+ Add Track</b> to create a new track from scratch</Step>
      <Step n="6">Use the filter buttons to view tracks by Act</Step>
    </Section>

    <Section title="2. Managing License Keys" color="var(--y3)">
      <Step n="1">Go to the <b>License Keys</b> tab</Step>
      <Step n="2">Enter a custom key name or leave blank for auto-generated</Step>
      <Step n="3">Click <b>Generate Key</b> to create it</Step>
      <Step n="4">Share the key with album purchasers — they enter it on the paywall to unlock Act III</Step>
      <Step n="5">Used keys show who redeemed them and when</Step>
    </Section>

    <Section title="3. Managing Users" color="var(--b3)">
      <Step n="1">Go to the <b>Users</b> tab to see all registered users</Step>
      <Step n="2">Click <b>Locked/Unlocked</b> to toggle a user's Act III access</Step>
      <Step n="3">Click <b>User/Admin</b> to grant or revoke admin access</Step>
    </Section>

    <Section title="4. Track Content (Guided Listening)" color="var(--b3)">
      <Step n="1">Go to the <b>Track Content</b> tab to add lore/lightcodes/shadowcodes</Step>
      <Step n="2">Click <b>Edit Content</b> on any track</Step>
      <Step n="3">Add <b>Backstory</b> (origin story), <b>Lightcodes</b> (positive transmissions), <b>Shadowcodes</b> (shadow patterns), and <b>System Role</b></Step>
      <Step n="4">Add a <b>Spotify URI</b> (e.g., spotify:track:xxxxx) to enable Spotify streaming. Find this by right-clicking a track in Spotify and selecting "Copy Spotify URI"</Step>
      <Step n="5">This content appears in the <b>Guided Listening Experience</b> while users stream tracks</Step>
    </Section>

    <Section title="5. How Users Access Content" color="var(--r3)">
      <Step n="1">New users register or sign in with Google</Step>
      <Step n="2">They see the Onboarding flow (emotional state + 2 entry options)</Step>
      <Step n="3">Acts I and II are free. Act III requires $29.99 or a license key</Step>
      <Step n="4">The Spin Wheel gives random track assignments from bonus tracks</Step>
      <Step n="5">The Guided Listening page streams tracks with synchronized lightcodes/shadowcodes</Step>
      <Step n="6">Users can share tracks on X/Twitter, Facebook, or copy links to clipboard</Step>
    </Section>

    <Section title="6. Audio File Requirements" color="var(--act)">
      <Step n="1">Supported formats: MP3, WAV, AAC, OGG, FLAC</Step>
      <Step n="2">Recommended: MP3 at 320kbps for best quality/size balance</Step>
      <Step n="3">Max file size: ~50MB per track</Step>
      <Step n="4">Files are stored permanently in cloud storage</Step>
      <Step n="5">Users can stream audio in-browser and download files</Step>
    </Section>
  </div>
);

const Section = ({ title, color, children }) => (
  <div style={{ marginBottom: 24, background: 'var(--panel)', border: '1px solid var(--border)', borderLeft: `3px solid ${color}`, padding: '16px 20px' }}>
    <div style={{ fontFamily: "'Cinzel',serif", fontSize: 13, fontWeight: 600, color, marginBottom: 12, letterSpacing: '0.06em' }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
  </div>
);

const Step = ({ n, children }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
    <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'var(--act)', width: 16, flexShrink: 0, textAlign: 'right' }}>{n}.</span>
    <span style={{ fontSize: 13, color: 'var(--white)', lineHeight: 1.55 }}>{children}</span>
  </div>
);


// ==================== MAIN ADMIN PANEL ====================
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('tracks');

  if (!user?.is_admin) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: 'var(--r3)', marginBottom: 12 }}>Access Denied</div>
        <div style={{ fontFamily: "'IM Fell English',serif", fontStyle: 'italic', fontSize: 15, color: 'var(--muted)' }}>
          You need admin privileges to access this panel.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(16px,2vw,22px)', fontWeight: 600, letterSpacing: '0.15em', color: 'var(--act)' }}>
          Admin Control Panel
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 8, letterSpacing: '0.3em', color: 'var(--muted)', textTransform: 'uppercase', marginTop: 4 }}>
          Manage tracks, audio, license keys, and users
        </div>
      </div>

      {/* Tabs */}
      <div data-testid="admin-tabs" style={{ display: 'flex', gap: 3, marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 3 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            data-testid={`admin-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px', fontFamily: "'Share Tech Mono',monospace", fontSize: 9,
              letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer',
              border: `1px solid ${activeTab === tab.id ? 'var(--act)' : 'var(--border)'}`,
              borderBottom: activeTab === tab.id ? '1px solid var(--void)' : '1px solid var(--border)',
              background: activeTab === tab.id ? 'var(--panel)' : 'transparent',
              color: activeTab === tab.id ? 'var(--act)' : 'var(--muted)',
              transition: 'all 0.15s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tracks' && <TracksTab />}
      {activeTab === 'content' && <ContentTab />}
      {activeTab === 'wheel' && <WheelConfigTab />}
      {activeTab === 'keys' && <KeysTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'guide' && <GuideTab />}
    </div>
  );
};

export default AdminPanel;
