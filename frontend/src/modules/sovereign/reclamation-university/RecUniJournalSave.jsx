import { useState } from 'react';
import { saveReclamationUniversityResponse } from '../../../lib/supabase/reclamationUniversity';

export default function RecUniJournalSave({ moduleId, selectedShadowCodes, retrievedLightCodes, declaration, integrationKey, disabled }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (disabled || status === 'saving') return;
    setStatus('saving');
    setMessage('');

    const result = await saveReclamationUniversityResponse({
      moduleId,
      selectedShadowCodes,
      retrievedLightCodes,
      declaration,
      integrationKey,
    });

    if (result?.error) {
      setStatus('error');
      setMessage(result.error.message || 'Unable to save this declaration yet.');
      return;
    }

    setStatus('saved');
    setMessage('Saved to your private Reclamation University record.');
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-black/55 p-5">
      <p className="text-[10px] uppercase tracking-[0.3em] text-red-300/70">Private Record</p>
      <h4 className="mt-2 text-xl font-semibold uppercase tracking-[0.12em] text-white">Save the declaration.</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">Store Module 1 completion, selected codes, retrieved laws, and the declaration in Supabase for the signed student record.</p>

      <button
        type="button"
        onClick={handleSave}
        disabled={disabled || status === 'saving'}
        className="mt-5 rounded-full border border-red-300/45 bg-red-950/40 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-red-50 transition enabled:hover:border-red-200 enabled:hover:bg-red-900/55 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-zinc-600"
      >
        {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Save Private Record'}
      </button>

      {message && <p className={`mt-4 text-xs leading-6 ${status === 'error' ? 'text-red-300' : 'text-red-100'}`}>{message}</p>}
    </section>
  );
}
