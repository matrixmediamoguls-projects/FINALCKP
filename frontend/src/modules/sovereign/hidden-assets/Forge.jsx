import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { Save, Trash2, Copy } from 'lucide-react';
import './Forge.css';

/**\n * Forge\n * \n * A hidden asset where students can craft and refine their own declarations\n * outside of module contexts. This is a creative space for personal reclamation.\n * \n * Features:\n * - Create custom declarations\n * - Save drafts\n * - Share declarations\n * - Track declaration history\n */\nexport default function Forge() {\n  const { user } = useAuth();
  const [declarations, setDeclarations] = useState([]);
  const [currentDeclaration, setCurrentDeclaration] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveDeclaration = async () => {
    if (!title.trim() || !currentDeclaration.trim()) {
      setError('Title and declaration are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const { error: saveError } = await supabase.from('rec_uni_journal_entries').insert([
        {
          user_id: user.id,
          entry_type: 'custom_declaration',
          title,
          body: currentDeclaration,
          payload: {
            type: 'forge_declaration',
            createdAt: new Date().toISOString(),
          },
        },
      ]);

      if (saveError) throw saveError;

      setSavedMessage('Declaration saved to your Archive!');
      setTitle('');
      setCurrentDeclaration('');

      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      console.error('Error saving declaration:', err);
      setError(err.message || 'Failed to save declaration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(currentDeclaration);
    setSavedMessage('Declaration copied to clipboard!');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const handleClear = () => {
    if (confirm('Clear this declaration?')) {
      setTitle('');
      setCurrentDeclaration('');
    }
  };

  return (
    <div className="forge">
      <div className="forge-background" aria-hidden="true">
        <div className="forge-flames" />
        <div className="forge-vignette" />
      </div>

      <div className="forge-container">
        <header className="forge-header">
          <div className="forge-icon">🔥</div>
          <h1>The Forge</h1>
          <p className="forge-subtitle">Craft your own declarations and reclamations</p>
        </header>

        {error && (
          <div className="forge-error">
            <p>{error}</p>
          </div>
        )}

        {savedMessage && (
          <div className="forge-success">
            <p>{savedMessage}</p>
          </div>
        )}

        <div className="forge-workspace">
          <div className="workspace-section">
            <label htmlFor="declaration-title" className="workspace-label">
              Declaration Title
            </label>
            <input
              id="declaration-title"
              type="text"
              placeholder="Name your declaration..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="workspace-input"
              maxLength={100}
            />
            <div className="input-counter">{title.length} / 100</div>
          </div>

          <div className="workspace-section">
            <label htmlFor="declaration-body" className="workspace-label">
              Your Declaration
            </label>
            <textarea
              id="declaration-body"
              placeholder="Write your declaration here. This is your space to articulate what you reclaim, what you release, and who you choose to become."
              value={currentDeclaration}
              onChange={(e) => setCurrentDeclaration(e.target.value)}
              className="workspace-textarea"
              rows={12}
              maxLength={5000}
            />
            <div className="input-counter">{currentDeclaration.length} / 5000</div>
          </div>

          <div className="workspace-actions">
            <button
              onClick={handleSaveDeclaration}
              disabled={isSaving || !title.trim() || !currentDeclaration.trim()}
              className="action-button primary"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save to Archive'}
            </button>
            <button
              onClick={handleCopyToClipboard}
              disabled={!currentDeclaration.trim()}
              className="action-button secondary"
            >
              <Copy size={18} />
              Copy
            </button>
            <button onClick={handleClear} className="action-button danger">
              <Trash2 size={18} />
              Clear
            </button>
          </div>
        </div>

        <div className="forge-guidance">
          <h2>Guidance for Your Declaration</h2>
          <div className="guidance-content">
            <p>
              <strong>What to declare:</strong> Your reclamations, your boundaries, your commitments to yourself.
            </p>
            <p>
              <strong>How to write:</strong> In first person. With clarity. With power. Your words are creative law.
            </p>
            <p>
              <strong>Why it matters:</strong> The act of declaration is the act of authorship. You are writing yourself
              into existence.
            </p>
            <p className="guidance-note">
              💡 Tip: Your declarations are private and saved to your Archive. You can create as many as you wish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
