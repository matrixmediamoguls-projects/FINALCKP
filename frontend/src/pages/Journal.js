import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Trash,
  PencilSimple,
  X,
  FloppyDisk,
  Tree,
  Drop,
  Fire,
  Wind
} from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const actOptions = [
  { value: '1', label: 'Act I - Fractured Veil', icon: Tree, color: 'text-chroma-earth' },
  { value: '2', label: 'Act II - Reclamation', icon: Fire, color: 'text-chroma-fire' },
  { value: '3', label: 'Act III - Reflection Chamber', icon: Drop, color: 'text-chroma-water' },
  { value: '4', label: 'Act IV - Crucible Code', icon: Wind, color: 'text-chroma-air' }
];

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedAct, setSelectedAct] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      if (editingEntry) {
        const response = await axios.put(`/journal/${editingEntry.id}`, {
          title,
          content,
          act: selectedAct ? parseInt(selectedAct) : null
        });
        setEntries(prev => prev.map(e => e.id === editingEntry.id ? response.data : e));
      } else {
        const response = await axios.post('/journal', {
          title,
          content,
          act: selectedAct ? parseInt(selectedAct) : null
        });
        setEntries(prev => [response.data, ...prev]);
      }
      handleCloseEditor();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId) => {
    try {
      await axios.delete(`/journal/${entryId}`);
      setEntries(prev => prev.filter(e => e.id !== entryId));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setSelectedAct(entry.act ? String(entry.act) : '');
    setShowEditor(true);
  };

  const handleNewEntry = () => {
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setSelectedAct('');
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingEntry(null);
    setTitle('');
    setContent('');
    setSelectedAct('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActInfo = (actNum) => {
    return actOptions.find(a => a.value === String(actNum));
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-chroma-base/80 backdrop-blur-md border-b border-chroma-border-default">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" data-testid="back-to-dashboard">
                <Button variant="ghost" size="icon" className="text-chroma-text-muted hover:text-chroma-gold">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <h1 className="font-heading text-lg font-bold text-chroma-text-primary tracking-tight">
                  JOURNAL
                </h1>
                <p className="mono-label text-[10px]">Seeker Reflections</p>
              </div>
            </div>
            <Button onClick={handleNewEntry} className="btn-gold" data-testid="new-entry-btn">
              <Plus size={18} className="mr-2" />
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-chroma-gold font-mono text-sm animate-pulse">
              LOADING JOURNAL...
            </div>
          </div>
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto border border-chroma-border-default flex items-center justify-center mb-6">
              <PencilSimple size={40} className="text-chroma-text-muted" />
            </div>
            <h3 className="font-heading text-xl text-chroma-text-primary mb-2">
              No Entries Yet
            </h3>
            <p className="text-chroma-text-secondary text-sm mb-6">
              Begin documenting your journey through the protocol
            </p>
            <Button onClick={handleNewEntry} className="btn-gold">
              <Plus size={18} className="mr-2" />
              Create First Entry
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {entries.map((entry, index) => {
                const actInfo = entry.act ? getActInfo(entry.act) : null;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="journal-card card-cyber p-6"
                    data-testid={`journal-entry-${entry.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {actInfo && (
                            <div className="flex items-center gap-1">
                              <actInfo.icon size={14} className={actInfo.color} />
                              <span className="mono-label text-[10px]">{actInfo.label.split(' - ')[0]}</span>
                            </div>
                          )}
                          <span className="mono-label text-[10px] text-chroma-text-muted">
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-semibold text-chroma-text-primary mb-2 truncate">
                          {entry.title}
                        </h3>
                        <p className="text-chroma-text-secondary text-sm line-clamp-3">
                          {entry.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                          className="text-chroma-text-muted hover:text-chroma-gold"
                          data-testid={`edit-entry-${entry.id}`}
                        >
                          <PencilSimple size={18} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id)}
                          className="text-chroma-text-muted hover:text-chroma-fire"
                          data-testid={`delete-entry-${entry.id}`}
                        >
                          <Trash size={18} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="bg-chroma-card border-chroma-border-default max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-chroma-text-primary">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="mono-label">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                data-testid="entry-title-input"
                className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none"
              />
            </div>
            <div className="space-y-2">
              <label className="mono-label">Related Act (Optional)</label>
              <Select value={selectedAct} onValueChange={setSelectedAct}>
                <SelectTrigger 
                  className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary rounded-none"
                  data-testid="act-select"
                >
                  <SelectValue placeholder="Select an act..." />
                </SelectTrigger>
                <SelectContent className="bg-chroma-card border-chroma-border-default">
                  {actOptions.map((act) => (
                    <SelectItem 
                      key={act.value} 
                      value={act.value}
                      className="text-chroma-text-primary hover:bg-chroma-surface focus:bg-chroma-surface"
                    >
                      <div className="flex items-center gap-2">
                        <act.icon size={14} className={act.color} />
                        {act.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="mono-label">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your reflections..."
                rows={8}
                data-testid="entry-content-input"
                className="bg-chroma-surface border-chroma-border-default text-chroma-text-primary placeholder:text-chroma-text-muted rounded-none resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={handleCloseEditor}
                className="text-chroma-text-muted hover:text-chroma-text-primary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving || !title.trim() || !content.trim()}
                className="btn-gold"
                data-testid="save-entry-btn"
              >
                <FloppyDisk size={18} className="mr-2" />
                {saving ? 'Saving...' : 'Save Entry'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Journal;
