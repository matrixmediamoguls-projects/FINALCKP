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
      setMessage(result.error.message || 'Unable to seal this private record yet.');
      return;
    }

    setStatus('saved');
    setMessage('Your Module 1 declaration has been sealed to your private Reclamation University record.');
  };

  return (
    <section className="fire-door-panel">
      <p className="fire-door-kicker">Scene 07 • Private Record</p>
      <h4 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">Seal the record.</h4>
      <p className="mt-3 text-sm leading-7 text-zinc-400">Store the marked Shadow Codes, retrieved Light Codes, First Law, and Integration Key as the Rising Seeker private record.</p>

      <button
        type="button"
        onClick={handleSave}
        disabled={disabled || status === 'saving'}
        className="fire-door-action mt-5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === 'saving' ? 'Sealing...' : status === 'saved' ? 'Record Sealed' : 'Seal Private Record'}
      </button>

      {message && <p className={`mt-4 text-sm leading-6 ${status === 'error' ? 'text-red-300' : 'text-red-100'}`}>{message}</p>}
    </section>
  );
}
