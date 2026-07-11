import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SovereignModulePanel from '../../../components/sovereign/SovereignModulePanel';
import FireDoorInitiationScene from './FireDoorInitiationScene';
import PairedTrackPortal from './PairedTrackPortal';
import ShadowCodeSelector from './ShadowCodeSelector';
import LightCodeMapper from './LightCodeMapper';
import DeclarationBuilder from './DeclarationBuilder';
import IntegrationKeyReveal from './IntegrationKeyReveal';
import RecUniJournalSave from './RecUniJournalSave';
import { useReclamationModuleProgress } from '../../../hooks/useReclamationModuleProgress';
import './fireDoorModule.css';
import './fireDoorModuleOverrides.css';

/**
 * ReclamationModuleEngine
 * 
 * A generic, reusable module orchestrator that handles:
 * - Loading curriculum module data
 * - Loading user's prior state
 * - Enforcing gate requirements
 * - Restoring the last active scene
 * - Mapping Shadow Codes to allowed Light Codes
 * - Validating declaration completion
 * - Saving progress incrementally
 * - Saving final completion record
 * - Revealing Integration Key only after completion criteria are met
 * - Emitting analytics events
 */

const SCENE_TITLES = [
  ['02', 'Signal Keys', 'Receive both ignition keys before the chamber advances.'],
  ['03', 'Shadow Code Scan', 'Mark the restriction that tried to rename the signal.'],
  ['04', 'Light Code Retrieval', 'Convert the marked pressure into a recoverable law.'],
  ['05', 'First Law Declaration', 'Write and seal the law of the self that cannot be erased.'],
  ['06', 'Fire Door Opens', 'Receive the Integration Key and seal the private record.'],
];

function SceneShell({ activeSceneIndex, canAdvance, lockMessage, onBack, onAdvance, onReplayTransmission, children }) {
  const activeScene = SCENE_TITLES[activeSceneIndex];
  const isFinalScene = activeSceneIndex === SCENE_TITLES.length - 1;

  return (
    <div className="fire-door-sequence-shell">
      <header className="fire-door-command-header">
        <div>
          <p className="fire-door-kicker">Rising Seeker Protocol</p>
          <h2>{activeScene[1]}</h2>
          <p>{activeScene[2]}</p>
        </div>
        <button type="button" className="fire-door-secondary-action" onClick={onReplayTransmission}>
          Replay Transmission
        </button>
      </header>

      <nav className="fire-door-scene-rail" aria-label="Module scene progress">
        {SCENE_TITLES.map(([number, title], index) => {
          const isActive = index === activeSceneIndex;
          const isPast = index < activeSceneIndex;
          return (
            <span key={title} className={`${isActive ? 'is-active' : ''} ${isPast ? 'is-past' : ''}`}>
              <b>{number}</b>
              <small>{title}</small>
            </span>
          );
        })}
      </nav>

      <section className="fire-door-active-scene" aria-label={activeScene[1]}>
        {children}
      </section>

      <footer className="fire-door-gate-controls">
        <button type="button" className="fire-door-secondary-action" onClick={onBack} disabled={activeSceneIndex === 0}>
          Previous Gate
        </button>
        <div>
          <span className={`fire-door-gate-status ${canAdvance || isFinalScene ? 'is-open' : ''}`}>
            {isFinalScene ? 'Final chamber active' : canAdvance ? 'Gate condition satisfied' : lockMessage}
          </span>
          {!isFinalScene && (
            <button type="button" className="fire-door-action" onClick={onAdvance} disabled={!canAdvance}>
              Open Next Gate
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ReclamationModuleEngine({ module, faculty }) {
  const navigate = useNavigate();
  const [hasCrossedFireDoor, setHasCrossedFireDoor] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [listenedTracks, setListenedTracks] = useState([]);
  const [selectedAnchorKey, setSelectedAnchorKey] = useState(null);
  const [selectedShadowCodes, setSelectedShadowCodes] = useState([]);
  const [retrievedLightCodes, setRetrievedLightCodes] = useState([]);
  const [declaration, setDeclaration] = useState({});
  const [declarationSealed, setDeclarationSealed] = useState(false);

  // Load progress from Supabase
  const { progress, isLoading, isSaving, saveProgress, saveCompletion, trackEvent } =
    useReclamationModuleProgress(module?.id, faculty?.slug, module?.slug);

  // Initialize from loaded progress
  useEffect(() => {
    if (progress && !isLoading) {
      setHasCrossedFireDoor(true);
      setActiveSceneIndex(progress.active_scene || 0);
      setListenedTracks(progress.listened_track_ids || []);
      setSelectedShadowCodes(progress.selected_shadow_codes || []);
      setRetrievedLightCodes(progress.retrieved_light_codes || []);
      setDeclaration(progress.declaration_json || {});
      if (progress.status === 'completed') {
        setDeclarationSealed(true);
      }
    }
  }, [progress, isLoading]);

  // Initialize default anchor key
  useEffect(() => {
    if (!selectedAnchorKey && module?.lyricAnchors?.length > 0) {
      setSelectedAnchorKey(module.lyricAnchors[0].key);
    }
  }, [module, selectedAnchorKey]);

  // Initialize declaration fields
  useEffect(() => {
    if (module?.declarationFields && Object.keys(declaration).length === 0) {
      const initialDeclaration = {};
      module.declarationFields.forEach((field) => {
        initialDeclaration[field.key] = '';
      });
      setDeclaration(initialDeclaration);
    }
  }, [module, declaration]);

  const isDeclarationComplete = useMemo(
    () => Object.values(declaration).every((value) => String(value || '').trim().length > 2),
    [declaration]
  );

  const moduleUnlocked = useMemo(
    () =>
      hasCrossedFireDoor &&
      listenedTracks.length === (module?.sourceTrackIds?.length || 0) &&
      selectedShadowCodes.length > 0 &&
      retrievedLightCodes.length > 0 &&
      declarationSealed,
    [hasCrossedFireDoor, listenedTracks, module, selectedShadowCodes, retrievedLightCodes, declarationSealed]
  );

  const requirements = [
    { label: 'Transmission received', complete: hasCrossedFireDoor },
    { label: `Both track signals received (${listenedTracks.length}/${module?.sourceTrackIds?.length || 0})`, complete: listenedTracks.length === (module?.sourceTrackIds?.length || 0) },
    { label: 'Shadow Code marked', complete: selectedShadowCodes.length > 0 },
    { label: 'Light Code retrieved', complete: retrievedLightCodes.length > 0 },
    { label: 'First Law sealed', complete: declarationSealed },
  ];

  const sceneAdvanceRules = [
    { canAdvance: listenedTracks.length === (module?.sourceTrackIds?.length || 0), lockMessage: `Receive all ${module?.sourceTrackIds?.length || 0} signal keys.` },
    { canAdvance: selectedShadowCodes.length > 0, lockMessage: 'Mark at least one Shadow Code.' },
    { canAdvance: retrievedLightCodes.length > 0, lockMessage: 'Retrieve at least one Light Code.' },
    { canAdvance: declarationSealed, lockMessage: 'Seal the First Law.' },
    { canAdvance: moduleUnlocked, lockMessage: 'Final chamber active.' },
  ];

  const toggleListenedTrack = (trackId) => {
    const newListenedTracks = listenedTracks.includes(trackId)
      ? listenedTracks.filter((item) => item !== trackId)
      : [...listenedTracks, trackId];
    setListenedTracks(newListenedTracks);
    trackEvent('track_listened', { trackId, listened: !listenedTracks.includes(trackId) });
  };

  const toggleShadowCode = (codeId) => {
    setSelectedShadowCodes((current) => {
      const next = current.includes(codeId) ? current.filter((item) => item !== codeId) : [...current, codeId];
      // Filter light codes to only those that map to selected shadow codes
      const allowedLightCodes = (module?.lightMappings || [])
        .filter((item) => next.includes(item.shadowId))
        .map((item) => item.lightId);
      setRetrievedLightCodes((lights) => lights.filter((item) => allowedLightCodes.includes(item)));
      trackEvent('shadow_code_selected', { codeId, selected: !current.includes(codeId) });
      return next;
    });
  };

  const toggleLightCode = (lightId) => {
    const isSelected = !retrievedLightCodes.includes(lightId);
    setRetrievedLightCodes((current) =>
      current.includes(lightId) ? current.filter((item) => item !== lightId) : [...current, lightId]
    );
    trackEvent('light_code_retrieved', { lightId, retrieved: isSelected });
  };

  const updateDeclaration = (field, value) => {
    setDeclarationSealed(false);
    setDeclaration((current) => ({ ...current, [field]: value }));
  };

  const handleSceneAdvance = async () => {
    const newSceneIndex = Math.min(SCENE_TITLES.length - 1, activeSceneIndex + 1);
    setActiveSceneIndex(newSceneIndex);

    // Save progress after advancing
    await saveProgress({
      status: 'in_progress',
      activeScene: newSceneIndex,
      listenedTrackIds: listenedTracks,
      selectedShadowCodes,
      retrievedLightCodes,
      declarationJson: declaration,
    });
  };

  const handleSaveCompletion = async () => {
    const result = await saveCompletion({
      selectedShadowCodes,
      retrievedLightCodes,
      declaration,
      integrationKey: module.integrationKey,
      journalEntry: {
        entryType: 'module_completion',
        title: `${faculty?.title} — ${module?.title}`,
        body: `Completed ${module?.title} and received Integration Key.`,
      },
    });

    return result;
  };

  const activeRule = sceneAdvanceRules[activeSceneIndex];

  // Build source tracks for the portal
  const sourceTracksForPortal = (module?.sourceTrackIds || []).map((trackId, index) => ({
    trackOrder: index + 1,
    keyLabel: `KEY ${String.fromCharCode(73 + index)}: ${module?.lyricAnchors?.[index]?.label || 'Signal Key'}`,
    title: trackId,
    function: module?.lyricAnchors?.[index]?.teaching || 'Receive the signal.',
    lyricAnchor: module?.lyricAnchors?.[index]?.line || '',
  }));

  const activeScene = [
    <PairedTrackPortal
      key="signal-keys"
      sourceTracks={sourceTracksForPortal}
      lyricAnchors={module?.lyricAnchors || []}
      listenedTracks={listenedTracks}
      selectedAnchorKey={selectedAnchorKey}
      onMarkListened={toggleListenedTrack}
      onAnchorSelect={setSelectedAnchorKey}
    />,
    <ShadowCodeSelector
      key="shadow-scan"
      shadowCodes={module?.shadowCodes || []}
      selectedShadowCodes={selectedShadowCodes}
      onToggleShadowCode={toggleShadowCode}
    />,
    <LightCodeMapper
      key="light-retrieval"
      mappings={module?.lightMappings || []}
      selectedShadowCodes={selectedShadowCodes}
      retrievedLightCodes={retrievedLightCodes}
      onRetrieveLightCode={toggleLightCode}
    />,
    <DeclarationBuilder
      key="first-law"
      declaration={declaration}
      declarationFields={module?.declarationFields || []}
      onChange={updateDeclaration}
      onComplete={() => setDeclarationSealed(isDeclarationComplete)}
      isComplete={isDeclarationComplete}
      isSealed={declarationSealed}
    />,
    <div key="final-unlock" className="fire-door-final-grid">
      <IntegrationKeyReveal
        isUnlocked={moduleUnlocked}
        integrationKey={module?.integrationKey || ''}
        badge={`${faculty?.title} — ${module?.title}`}
        nextPath={`Next Module — ${faculty?.title}`}
        requirements={requirements}
      />
      <RecUniJournalSave
        moduleId={module?.id}
        selectedShadowCodes={selectedShadowCodes}
        retrievedLightCodes={retrievedLightCodes}
        declaration={declaration}
        integrationKey={module?.integrationKey || ''}
        disabled={!moduleUnlocked}
        onSave={handleSaveCompletion}
        isSaving={isSaving}
      />
    </div>,
  ][activeSceneIndex];

  if (!module) {
    return (
      <div className="fire-door-module-root">
        <SovereignModulePanel eyebrow="Reclamation University" title="Module Not Found">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>This module could not be loaded. Please return to the university.</p>
            <button
              type="button"
              onClick={() => navigate('/experiencemode/sovereign/reclamation-university')}
              style={{ marginTop: '1rem' }}
            >
              Return to University
            </button>
          </div>
        </SovereignModulePanel>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fire-door-module-root">
        <SovereignModulePanel eyebrow="Reclamation University" title="Loading Module">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Initializing module experience...</p>
          </div>
        </SovereignModulePanel>
      </div>
    );
  }

  return (
    <div className="fire-door-module-root">
      {!hasCrossedFireDoor ? (
        <FireDoorInitiationScene
          copy={module?.initiationCopy || []}
          onCross={() => {
            setHasCrossedFireDoor(true);
            trackEvent('fire_door_crossed');
            saveProgress({
              status: 'in_progress',
              activeScene: 0,
              listenedTrackIds: [],
              selectedShadowCodes: [],
              retrievedLightCodes: [],
              declarationJson: {},
            });
          }}
        />
      ) : (
        <SovereignModulePanel eyebrow={faculty?.title} title={module?.title}>
          <SceneShell
            activeSceneIndex={activeSceneIndex}
            canAdvance={activeRule.canAdvance}
            lockMessage={activeRule.lockMessage}
            onBack={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
            onAdvance={handleSceneAdvance}
            onReplayTransmission={() => setActiveSceneIndex(0)}
          >
            {activeScene}
          </SceneShell>
        </SovereignModulePanel>
      )}
    </div>
  );
}
