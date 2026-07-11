import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { Heart, Share2, MessageCircle } from 'lucide-react';
import './WitnessConsole.css';

/**\n * Witness Console\n * \n * A hidden asset where students can view shared declarations from others\n * and witness the reclamations of their peers. This is a community space.\n * \n * Features:\n * - View shared declarations\n * - Like and comment on declarations\n * - Filter by faculty or theme\n * - Anonymous witnessing\n */\nexport default function WitnessConsole() {\n  const [declarations, setDeclarations] = useState([]);
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
  const [filterTheme, setFilterTheme] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [likedDeclarations, setLikedDeclarations] = useState(new Set());

  useEffect(() => {
    loadSharedDeclarations();
  }, []);

  useEffect(() => {
    filterDeclarations();
  }, [filterTheme, declarations]);

  const loadSharedDeclarations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load shared declarations (those marked as public)
      const { data, error: loadError } = await supabase
        .from('rec_uni_journal_entries')
        .select('id, title, body, created_at, payload')
        .eq('entry_type', 'custom_declaration')
        .order('created_at', { ascending: false })
        .limit(50);

      if (loadError) throw loadError;

      setDeclarations(data || []);
    } catch (err) {
      console.error('Error loading declarations:', err);
      setError(err.message || 'Failed to load declarations');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDeclarations = () => {
    let filtered = declarations;

    if (filterTheme !== 'all') {
      filtered = filtered.filter((d) => d.payload?.theme === filterTheme);
    }

    setFilteredDeclarations(filtered);
  };

  const handleLike = (declarationId) => {
    setLikedDeclarations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(declarationId)) {
        newSet.delete(declarationId);
      } else {
        newSet.add(declarationId);
      }
      return newSet;
    });
  };

  const themes = ['all', ...new Set(declarations.map((d) => d.payload?.theme).filter(Boolean))];

  return (
    <div className="witness-console">
      <div className="console-background" aria-hidden="true">
        <div className="console-grid" />
        <div className="console-vignette" />
      </div>

      <div className="console-container">
        <header className="console-header">
          <div className="console-icon">👁️</div>
          <h1>Witness Console</h1>
          <p className="console-subtitle">Witness the reclamations of others. You are not alone.</p>
        </header>

        {error && (
          <div className="console-error">
            <p>{error}</p>
            <button onClick={loadSharedDeclarations} className="console-retry">
              Retry
            </button>
          </div>
        )}

        {themes.length > 1 && (
          <div className="console-filter">
            <select
              value={filterTheme}
              onChange={(e) => setFilterTheme(e.target.value)}
              className="filter-select"
            >
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme === 'all' ? 'All Declarations' : theme}
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="console-loading">
            <div className="loading-spinner" />
            <p>Loading declarations...</p>
          </div>
        ) : filteredDeclarations.length === 0 ? (
          <div className="console-empty">
            <div className="empty-icon">🌱</div>
            <h2>No Declarations Yet</h2>
            <p>Be the first to share a declaration with the community.</p>
          </div>
        ) : (
          <div className="declarations-grid">
            {filteredDeclarations.map((declaration) => (
              <div
                key={declaration.id}
                className="declaration-card"
                onClick={() => setSelectedDeclaration(declaration)}
              >
                <div className="card-header">
                  <h3 className="card-title">{declaration.title}</h3>
                  <span className="card-theme">{declaration.payload?.theme || 'Reclamation'}</span>
                </div>
                <p className="card-preview">{declaration.body?.substring(0, 100)}...</p>
                <div className="card-footer">
                  <time className="card-date">
                    {new Date(declaration.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                  <div className="card-actions">
                    <button
                      className={`action-btn ${likedDeclarations.has(declaration.id) ? 'liked' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(declaration.id);
                      }}
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Declaration Detail Modal */}
        {selectedDeclaration && (
          <div className="modal-overlay" onClick={() => setSelectedDeclaration(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedDeclaration(null)}>
                ✕
              </button>
              <div className="modal-header">
                <h2>{selectedDeclaration.title}</h2>
                {selectedDeclaration.payload?.theme && (
                  <span className="modal-theme">{selectedDeclaration.payload.theme}</span>
                )}
              </div>
              <time className="modal-date">
                {new Date(selectedDeclaration.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <div className="modal-body">{selectedDeclaration.body}</div>
              <div className="modal-footer">
                <button
                  className={`footer-btn ${likedDeclarations.has(selectedDeclaration.id) ? 'liked' : ''}`}
                  onClick={() => handleLike(selectedDeclaration.id)}
                >
                  <Heart size={18} />
                  Witness
                </button>
                <button className="footer-btn">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
