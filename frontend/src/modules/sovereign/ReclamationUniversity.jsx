import { useMemo, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import FireDoorInitiationScene from './reclamation-university/FireDoorInitiationScene';
import PairedTrackPortal from './reclamation-university/PairedTrackPortal';
import ShadowCodeSelector from './reclamation-university/ShadowCodeSelector';
import LightCodeMapper from './reclamation-university/LightCodeMapper';
import DeclarationBuilder from './reclamation-university/DeclarationBuilder';
import IntegrationKeyReveal from './reclamation-university/IntegrationKeyReveal';
import RecUniJournalSave from './reclamation-university/RecUniJournalSave';
import './reclamation-university/fireDoorModule.css';
import './reclamation-university/fireDoorModuleOverrides.css';

const INITIATION_COPY = [
  'Welcome, Rising Seeker. Module 1: The Fire Door.',
  'You are not here to learn how to become powerful. You are here to notice where power was already present and where another system attempted to restrict it, redirect it, or rename it.',
  'The first fire often arrives disguised as betrayal. Someone takes credit. Someone stays silent. Someone benefits while you disappear. Someone tells you that your voice is too strange, too synthetic, too late, too much, or too dangerous. The old lesson says: grieve the theft and wait for the world to correct it. Reclamation teaches something sharper: audit the theft, retrieve the signal, and sign the work.',
  'This module does not ask you to deny what happened. Denial is not light. Denial is another mask. You are asked to look directly at what tried to contain your calling, then identify the fire hidden inside the pressure.',
  'When the lyric says the body can be chained but truth cannot, it is teaching a core Reclamation principle. Circumstances can limit movement. Systems can delay process. People can obscure a record. But the truth itself remains mobile. It moves through voice, pattern, testimony, timing, and code.',
  'Your work in this module is to cross the Fire Door. To cross it, name the restriction, retrieve the authorship, and speak the first law of the self that cannot be erased.',
];

const SOURCE_TRACKS = [
  {
    trackOrder: 1,
    keyLabel: 'KEY I: AUTHORSHIP IGNITION',
    title: 'Welcome To The Fire Act Three Overture',
    function: 'The Rising Seeker stops negotiating with erasure and identifies the systems that tried to restrict the calling.',
    lyricAnchor: 'You cannot sign away what God wrote in me.',
  },
  {
    trackOrder: 2,
    keyLabel: 'KEY II: TRUTH LIBERATION',
    title: 'Reclamation The Day Musiq Matrix Came Back',
    function: 'The Rising Seeker learns that a restricted season can delay movement without owning the truth.',
    lyricAnchor: 'They can chain your body, but they will never chain your truth.',
  },
];

const LYRIC_ANCHORS = [
  { key: 'authorship', label: 'Authorship Cannot Be Signed Away', teaching: 'Divine inscription overrides counterfeit authority.', line: 'You cannot sign away what God wrote in me.' },
  { key: 'fire', label: 'Fire as Fuel', teaching: 'Pressure becomes ignition when it is consciously metabolized.', line: 'Thank you for the fire. I did not know I needed it to rise.' },
  { key: 'voice', label: 'Voice as Code', teaching: 'The voice is identity, evidence, transmission, and right.', line: 'They fear your voice.' },
  { key: 'chamber', label: 'Chamber as Mirror', teaching: 'The last chamber becomes the first door.', line: 'The Chamber was reflection, not your grave.' },
];

const SHADOW_CODES = [
  {
    id: 'SC-01',
    title: 'The Contracted Calling',
    definition: 'The belief that gatekeepers, paperwork, platforms, or social arrangements can override what the soul was built to carry.',
    diagnostic: 'Where have I treated someone else’s restriction as stronger than my original assignment?',
  },
  {
    id: 'SC-02',
    title: 'Stolen Authorship',
    definition: 'The distortion where another person occupies the room, language, work, frequency, or creative DNA that originated elsewhere.',
    diagnostic: 'What part of my story, work, or identity have I allowed to remain unsigned?',
  },
  {
    id: 'SC-03',
    title: 'Witness Silence',
    definition: 'The shadow of people who are present to harm or distortion but protect their image by pretending neutrality.',
    diagnostic: 'Where did silence become evidence?',
  },
  {
    id: 'SC-04',
    title: 'Restricted Light',
    definition: 'The false idea that being unsupported, blocked, or delayed means the light has failed.',
    diagnostic: 'Where has compression actually made my signal stronger?',
  },
  {
    id: 'SC-05',
    title: 'The Cage Narrative',
    definition: 'The attempt to define the self through confinement, confusion, delay, or public erasure.',
    diagnostic: 'What part of me remained free even when circumstances were not?',
  },
  {
    id: 'SC-06',
    title: 'Energy Redirect',
    definition: 'The extraction of attention, lifeforce, vision, or spiritual signal for another person’s advancement.',
    diagnostic: 'Where has my energy been redirected away from my own assignment?',
  },
  {
    id: 'SC-07',
    title: 'The Smallness Script',
    definition: 'The lie that opposition would not gather if the Seeker carried no power.',
    diagnostic: 'What does the scale of resistance reveal about the scale of the gift?',
  },
];

const LIGHT_MAPPINGS = [
  { shadowId: 'SC-01', shadowTitle: 'Contracted Calling', lightId: 'LC-01', lightTitle: 'Divine Inscription', activation: 'The Rising Seeker remembers that the original text was written before the counterfeit contract.', replacementLaw: 'No external agreement can override what was originally written into me.' },
  { shadowId: 'SC-02', shadowTitle: 'Stolen Authorship', lightId: 'LC-02', lightTitle: 'Signed Authorship', activation: 'The Rising Seeker stops waiting for validation and places their own name on the work, truth, and law they carry.', replacementLaw: 'I authorize my own name, my own work, and my own record.' },
  { shadowId: 'SC-03', shadowTitle: 'Witness Silence', lightId: 'LC-03', lightTitle: 'Public Record', activation: 'Silence does not erase the record. It delays the reveal until the evidence has matured.', replacementLaw: 'Silence may hide truth for a season, but evidence matures in the open.' },
  { shadowId: 'SC-04', shadowTitle: 'Restricted Light', lightId: 'LC-04', lightTitle: 'Fire Conversion', activation: 'Suppression compresses the signal until it becomes concentrated enough to ignite.', replacementLaw: 'What compressed me clarified me.' },
  { shadowId: 'SC-05', shadowTitle: 'Cage Narrative', lightId: 'LC-05', lightTitle: 'Voice as Code', activation: 'The truth remains mobile through voice, pattern, testimony, timing, and code.', replacementLaw: 'My circumstances may have held my movement, but they never owned my truth.' },
  { shadowId: 'SC-06', shadowTitle: 'Energy Redirect', lightId: 'LC-06', lightTitle: 'Reclaimed Signal', activation: 'The Rising Seeker identifies where attention and lifeforce were redirected, then returns the signal to its rightful assignment.', replacementLaw: 'My energy returns to the assignment it was built to power.' },
  { shadowId: 'SC-07', shadowTitle: 'Smallness Script', lightId: 'LC-07', lightTitle: 'Bigger Cage, Louder Call', activation: 'Resistance is reframed as evidence of calling, not proof of failure.', replacementLaw: 'The scale of resistance confirms the scale of what I carry.' },
];

const INTEGRATION_KEY = 'The lock was never on the true self. The lock was on the story you were taught to believe about the true self.';
const INITIAL_DECLARATION = { restriction: '', authorship: '', fireLesson: '', newLaw: '' };

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
        <button type="button" className="fire-door-secondary-action" onClick={onReplayTransmission}>Replay Transmission</button>
      </header>

      <nav className="fire-door-scene-rail" aria-label="Module 1 scene progress">
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
        <button type="button" className="fire-door-secondary-action" onClick={onBack} disabled={activeSceneIndex === 0}>Previous Gate</button>
        <div>
          <span className={`fire-door-gate-status ${canAdvance || isFinalScene ? 'is-open' : ''}`}>
            {isFinalScene ? 'Final chamber active' : canAdvance ? 'Gate condition satisfied' : lockMessage}
          </span>
          {!isFinalScene && (
            <button type="button" className="fire-door-action" onClick={onAdvance} disabled={!canAdvance}>Open Next Gate</button>
          )}
        </div>
      </footer>
    </div>
  );
}

export default function ReclamationUniversity() {
  const [hasCrossedFireDoor, setHasCrossedFireDoor] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [listenedTracks, setListenedTracks] = useState([]);
  const [selectedAnchorKey, setSelectedAnchorKey] = useState(LYRIC_ANCHORS[0].key);
  const [selectedShadowCodes, setSelectedShadowCodes] = useState([]);
  const [retrievedLightCodes, setRetrievedLightCodes] = useState([]);
  const [declaration, setDeclaration] = useState(INITIAL_DECLARATION);
  const [declarationSealed, setDeclarationSealed] = useState(false);

  const isDeclarationComplete = useMemo(
    () => Object.values(declaration).every((value) => String(value || '').trim().length > 2),
    [declaration]
  );

  const moduleUnlocked = hasCrossedFireDoor && listenedTracks.length === SOURCE_TRACKS.length && selectedShadowCodes.length > 0 && retrievedLightCodes.length > 0 && declarationSealed;

  const requirements = [
    { label: 'Transmission received', complete: hasCrossedFireDoor },
    { label: 'Both track signals received', complete: listenedTracks.length === SOURCE_TRACKS.length },
    { label: 'Shadow Code marked', complete: selectedShadowCodes.length > 0 },
    { label: 'Light Code retrieved', complete: retrievedLightCodes.length > 0 },
    { label: 'First Law sealed', complete: declarationSealed },
  ];

  const sceneAdvanceRules = [
    { canAdvance: listenedTracks.length === SOURCE_TRACKS.length, lockMessage: 'Receive both signal keys.' },
    { canAdvance: selectedShadowCodes.length > 0, lockMessage: 'Mark at least one Shadow Code.' },
    { canAdvance: retrievedLightCodes.length > 0, lockMessage: 'Retrieve at least one Light Code.' },
    { canAdvance: declarationSealed, lockMessage: 'Seal the First Law.' },
    { canAdvance: moduleUnlocked, lockMessage: 'Final chamber active.' },
  ];

  const toggleListenedTrack = (trackOrder) => {
    setListenedTracks((current) =>
      current.includes(trackOrder) ? current.filter((item) => item !== trackOrder) : [...current, trackOrder]
    );
  };

  const toggleShadowCode = (codeId) => {
    setSelectedShadowCodes((current) => {
      const next = current.includes(codeId) ? current.filter((item) => item !== codeId) : [...current, codeId];
      const allowedLightCodes = LIGHT_MAPPINGS.filter((item) => next.includes(item.shadowId)).map((item) => item.lightId);
      setRetrievedLightCodes((lights) => lights.filter((item) => allowedLightCodes.includes(item)));
      return next;
    });
  };

  const toggleLightCode = (lightId) => {
    setRetrievedLightCodes((current) =>
      current.includes(lightId) ? current.filter((item) => item !== lightId) : [...current, lightId]
    );
  };

  const updateDeclaration = (field, value) => {
    setDeclarationSealed(false);
    setDeclaration((current) => ({ ...current, [field]: value }));
  };

  const activeRule = sceneAdvanceRules[activeSceneIndex];

  const activeScene = [
    <PairedTrackPortal
      key="signal-keys"
      sourceTracks={SOURCE_TRACKS}
      lyricAnchors={LYRIC_ANCHORS}
      listenedTracks={listenedTracks}
      selectedAnchorKey={selectedAnchorKey}
      onMarkListened={toggleListenedTrack}
      onAnchorSelect={setSelectedAnchorKey}
    />,
    <ShadowCodeSelector
      key="shadow-scan"
      shadowCodes={SHADOW_CODES}
      selectedShadowCodes={selectedShadowCodes}
      onToggleShadowCode={toggleShadowCode}
    />,
    <LightCodeMapper
      key="light-retrieval"
      mappings={LIGHT_MAPPINGS}
      selectedShadowCodes={selectedShadowCodes}
      retrievedLightCodes={retrievedLightCodes}
      onRetrieveLightCode={toggleLightCode}
    />,
    <DeclarationBuilder
      key="first-law"
      declaration={declaration}
      onChange={updateDeclaration}
      onComplete={() => setDeclarationSealed(isDeclarationComplete)}
      isComplete={isDeclarationComplete}
      isSealed={declarationSealed}
    />,
    <div key="final-unlock" className="fire-door-final-grid">
      <IntegrationKeyReveal
        isUnlocked={moduleUnlocked}
        integrationKey={INTEGRATION_KEY}
        badge="Fire Door Opened"
        nextPath="Module 2 — Shadow Code Recognition"
        requirements={requirements}
      />
      <RecUniJournalSave
        moduleId="ACT3-RU-M01"
        selectedShadowCodes={selectedShadowCodes}
        retrievedLightCodes={retrievedLightCodes}
        declaration={declaration}
        integrationKey={INTEGRATION_KEY}
        disabled={!moduleUnlocked}
      />
    </div>,
  ][activeSceneIndex];

  return (
    <div className="fire-door-module-root">
      {!hasCrossedFireDoor ? (
        <FireDoorInitiationScene copy={INITIATION_COPY} onCross={() => setHasCrossedFireDoor(true)} />
      ) : (
        <SovereignModulePanel eyebrow="Reclamation University" title="Module 1: The Fire Door">
          <SceneShell
            activeSceneIndex={activeSceneIndex}
            canAdvance={activeRule.canAdvance}
            lockMessage={activeRule.lockMessage}
            onBack={() => setActiveSceneIndex((current) => Math.max(0, current - 1))}
            onAdvance={() => setActiveSceneIndex((current) => Math.min(SCENE_TITLES.length - 1, current + 1))}
            onReplayTransmission={() => {
              setActiveSceneIndex(0);
              setHasCrossedFireDoor(false);
            }}
          >
            {activeScene}
          </SceneShell>
        </SovereignModulePanel>
      )}
    </div>
  );
}
