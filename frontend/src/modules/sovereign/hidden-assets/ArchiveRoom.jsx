import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { supabase } from '../../../lib/supabase/client';
import { Search, FileText, Calendar, Lock } from 'lucide-react';
import './ArchiveRoom.css';

/**\n * Archive Room\n * \n * A hidden asset where students can view and search their complete\n * journal records, certificates, and learning history.\n * \n * Features:\n * - Search and filter journal entries\n * - View complete learning timeline\n * - Export records\n * - Privacy controls\n */\nexport default function ArchiveRoom() {\n  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    if (user) {
      loadArchiveEntries();
    }
  }, [user]);

  useEffect(() => {
    filterEntries();
  }, [searchTerm, filterType, entries]);

  const loadArchiveEntries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: loadError } = await supabase
        .from('rec_uni_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;

      setEntries(data || []);
    } catch (err) {
      console.error('Error loading archive entries:', err);
      setError(err.message || 'Failed to load archive entries');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (filterType !== 'all') {
      filtered = filtered.filter((entry) => entry.entry_type === filterType);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          entry.title?.toLowerCase().includes(term) ||
          entry.body?.toLowerCase().includes(term)
      );
    }

    setFilteredEntries(filtered);
  };

  const entryTypes = ['all', ...new Set(entries.map((e) => e.entry_type))];

  return (
    <div className="archive-room">
      <div className="archive-background" aria-hidden="true">
        <div className="archive-shelves" />
        <div className="archive-vignette" />
      </div>

      <div className="archive-container">
        <header className="archive-header">
          <div className="archive-icon">📚</div>
          <h1>Archive Room</h1>
          <p className="archive-subtitle">Your complete learning record and history</p>
        </header>

        {error && (
          <div className="archive-error">
            <p>{error}</p>
            <button onClick={loadArchiveEntries} className="archive-retry">
              Retry
            </button>
          </div>
        )}

        <div className="archive-controls">
          <div className="archive-search">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search your records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="archive-filter">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              {entryTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Entries' : type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="archive-loading">
            <div className="loading-spinner" />
            <p>Loading your archive...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="archive-empty">
            <div className="empty-icon">🔍</div>
            <h2>No Records Found</h2>
            <p>Your learning journey will be recorded here as you complete modules.</p>
          </div>
        ) : (
          <div className="archive-timeline">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="timeline-item"
                onClick={() => setSelectedEntry(entry)}
              >
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <div className="entry-header">
                    <h3 className="entry-title">{entry.title}</h3>
                    <span className="entry-type">{entry.entry_type.replace(/_/g, ' ')}</span>
                  </div>
                  <p className="entry-preview">{entry.body?.substring(0, 150)}...</p>
                  <div className="entry-meta">
                    <Calendar size={14} />
                    <time>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Entry Detail Modal */}
        {selectedEntry && (
          <div className="modal-overlay" onClick={() => setSelectedEntry(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedEntry(null)}>
                ✕
              </button>
              <div className="modal-header">
                <h2>{selectedEntry.title}</h2>
                <span className="modal-type">{selectedEntry.entry_type.replace(/_/g, ' ')}</span>
              </div>
              <div className="modal-meta">
                <Calendar size={16} />
                <time>
                  {new Date(selectedEntry.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <div className="modal-body">{selectedEntry.body}</div>
              {selectedEntry.payload && (
                <div className="modal-payload">
                  <details>
                    <summary>View Full Record</summary>
                    <pre>{JSON.stringify(selectedEntry.payload, null, 2)}</pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
