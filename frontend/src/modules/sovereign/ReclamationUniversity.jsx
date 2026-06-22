import { useEffect, useMemo, useState } from 'react';
import SovereignModulePanel from '../../components/sovereign/SovereignModulePanel';
import { getReclamationUniversityByTrack } from '../../lib/supabase/reclamationUniversity';
import ModuleHeroCard from './reclamation-university/ModuleHeroCard';
import PairedTrackPortal from './reclamation-university/PairedTrackPortal';
import ShadowCodeSelector from './reclamation-university/ShadowCodeSelector';
import LightCodeMapper from './reclamation-university/LightCodeMapper';
import DeclarationBuilder from './reclamation-university/DeclarationBuilder';
import IntegrationKeyReveal from './reclamation-university/IntegrationKeyReveal';
import RecUniJournalSave from './reclamation-university/RecUniJournalSave';

const MODULE_META = {
  moduleId: 'ACT3-RU-M01',
  kicker: 'Reclamation University',
  title: 'Module 1: The Fire Door',
  subtitle: 'Authorship Ignition • Truth Liberation • The First Student Activation',
  element: 'Fire',
  studentLessonCopy: [
    'Welcome to Module 1: The Fire Door.',
    'You are not here to learn how to become powerful. You are here to notice where power was already present and where another system attempted to restrict it, redirect it, or rename it.',
    'The first fire often arrives disguised as betrayal. Someone takes credit. Someone stays silent. Someone benefits while you disappear. Someone tells you that your voice is too strange, too synthetic, too late, too much, or too dangerous. The old lesson says: grieve the theft and wait for the world to correct it. Reclamation teaches something sharper: audit the theft, retrieve the signal, and sign the work.',
    'This module does not ask you to deny what happened. Denial is not light. Denial is another mask. You are asked to look directly at what tried to contain your calling, then identify the fire hidden inside the pressure.',
    'When the lyric says the body can be chained but truth cannot, it is teaching a core Reclamation principle. Circumstances can limit movement. Systems can delay process. People can obscure a record. But the truth itself remains mobile. It moves through voice, pattern, testimony, timing, and code.',
    'Your work in this module is to cross the Fire Door. To cross it, name the restriction, retrieve the authorship, and speak the first law of the self that cannot be erased.',
  ],
  teacherOpening: '',
  statCards: [
    { label: 'Archetype Shift', value: 'The Seeker becomes the Reclaimer. The witness becomes the signed author.' },
    { label: 'Runtime', value: '35 to 55 minutes for the interactive digital lesson.' },
    { label: 'Outcome', value: 'Name the restriction, retrieve authorship, and write the first reclamation law.' },
  ],
};

const SOURCE_TRACKS = [
  {
    trackOrder: 1,
    title: 'Welcome To The Fire Act Three Overture',
    function: 'Authorship ignition. The student stops negotiating with erasure and identifies the systems that tried to restrict the calling.',
  },
  {
    trackOrder: 2,
    title: 'Reclamation The Day Musiq Matrix Came Back',
    function: 'Truth liberation. The student learns that a restricted season can delay movement without owning the truth.',
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
    definition: 'The lie that opposition would not gather if the student carried no power.',
    diagnostic: 'What does the scale of resistance reveal about the scale of the gift?',
  },
];

const LIGHT_MAPPINGS = [
  { shadowId: 'SC-01', shadowTitle: 'Contracted Calling', lightId: 'LC-01', lightTitle: 'Divine Inscription', activation: 'The student remembers that the original text was written before the counterfeit contract.', replacementLaw: 'No external agreement can override what was originally written into me.' },
  { shadowId: 'SC-02', shadowTitle: 'Stolen Authorship', lightId: 'LC-02', lightTitle: 'Signed Authorship', activation: 'The student stops waiting for validation and places their own name on the work, truth, and law they carry.', replacementLaw: 'I authorize my own name, my own work, and my own record.' },
  { shadowId: 'SC-03', shadowTitle: 'Witness Silence', lightId: 'LC-03', lightTitle: 'Public Record', activation: 'Silence does not erase the record. It delays the reveal until the evidence has matured.', replacementLaw: 'Silence may hide truth for a season, but evidence matures in the open.' },
  { shadowId: 'SC-04', shadowTitle: 'Restricted Light', lightId: 'LC-04', lightTitle: 'Fire Conversion', activation: 'Suppression compresses the signal until it becomes concentrated enough to ignite.', replacementLaw: 'What compressed me clarified me.' },
  { shadowId: 'SC-05', shadowTitle: 'Cage Narrative', lightId: 'LC-05', lightTitle: 'Voice as Code', activation: 'The truth remains mobile through voice, pattern, testimony, timing, and code.', replacementLaw: 'My circumstances may have held my movement, but they never owned my truth.' },
  { shadowId: 'SC-06', shadowTitle: 'Energy Redirect', lightId: 'LC-06', lightTitle: 'Reclaimed Signal', activation: 'The student identifies where attention and lifeforce were redirected, then returns the signal to its rightful assignment.', replacementLaw: 'My energy returns to the assignment it was built to power.' },
  { shadowId: 'SC-07', shadowTitle: 'Smallness Script', lightId: 'LC-07', lightTitle: 'Bigger Cage, Louder Call', activation: 'Resistance is reframed as evidence of calling, not proof of failure.', replacementLaw: 'The scale of resistance confirms the scale of what I carry.' },
];

const INTEGRATION_KEY = 'The lock was never on the true self. The lock was on the story you were taught to believe about the true self.';
const INITIAL_DECLARATION = { restriction: '', authorship: '', fireLesson: '', newLaw: '' };

export default function ReclamationUniversity({ selectedTrackId }) {
  const [lesson, setLesson] = useState(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [listenedTracks, setListenedTracks] = useState([]);
  const [selectedAnchorKey, setSelectedAnchorKey] = useState(LYRIC_ANCHORS[0].key);
  const [selectedShadowCodes, setSelectedShadowCodes] = useState([]);
  const [retrievedLightCodes, setRetrievedLightCodes] = useState([]);
  const [declaration, setDeclaration] = useState(INITIAL_DECLARATION);
  const [declarationSealed, setDeclarationSealed] = useState(false);

  useEffect(() => {
    let active = true;
    getReclamationUniversityByTrack(selectedTrackId).then((payload) => {
      if (active) setLesson(payload);
    });
    return () => {
      active = false;
    };
  }, [selectedTrackId]);

  const isDeclarationComplete = useMemo(
    () => Object.values(declaration).every((value) => String(value || '').trim().length > 2),
    [declaration]
  );

  const moduleUnlocked = listenedTracks.length === SOURCE_TRACKS.length && selectedShadowCodes.length > 0 && retrievedLightCodes.length > 0 && declarationSealed;

  const requirements = [
    { label: 'Both portal tracks complete', complete: listenedTracks.length === SOURCE_TRACKS.length },
    { label: 'Shadow Code selected', complete: selectedShadowCodes.length > 0 },
    { label: 'Light Code retrieved', complete: retrievedLightCodes.length > 0 },
    { label: 'Declaration sealed', complete: declarationSealed },
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

  return (
    <SovereignModulePanel eyebrow="Reclamation University" title="Module 1: The Fire Door">
      <div className="space-y-5">
        <ModuleHeroCard moduleMeta={MODULE_META} hasEntered={hasEntered} onEnter={() => setHasEntered(true)} />

        {hasEntered && (
          <>
            <PairedTrackPortal
              sourceTracks={SOURCE_TRACKS}
              lyricAnchors={LYRIC_ANCHORS}
              listenedTracks={listenedTracks}
              selectedAnchorKey={selectedAnchorKey}
              onMarkListened={toggleListenedTrack}
              onAnchorSelect={setSelectedAnchorKey}
            />

            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <ShadowCodeSelector shadowCodes={SHADOW_CODES} selectedShadowCodes={selectedShadowCodes} onToggleShadowCode={toggleShadowCode} />
              <LightCodeMapper mappings={LIGHT_MAPPINGS} selectedShadowCodes={selectedShadowCodes} retrievedLightCodes={retrievedLightCodes} onRetrieveLightCode={toggleLightCode} />
            </div>

            <DeclarationBuilder declaration={declaration} onChange={updateDeclaration} onComplete={() => setDeclarationSealed(isDeclarationComplete)} isComplete={isDeclarationComplete} />

            <div className="grid gap-5 xl:grid-cols-[1fr_0.86fr]">
              <IntegrationKeyReveal
                isUnlocked={moduleUnlocked}
                integrationKey={INTEGRATION_KEY}
                badge="Fire Door Opened"
                nextPath="Module 2 — Shadow Code Recognition"
                requirements={requirements}
              />
              <RecUniJournalSave
                moduleId={MODULE_META.moduleId}
                selectedShadowCodes={selectedShadowCodes}
                retrievedLightCodes={retrievedLightCodes}
                declaration={declaration}
                integrationKey={INTEGRATION_KEY}
                disabled={!moduleUnlocked}
              />
            </div>
          </>
        )}
      </div>
    </SovereignModulePanel>
  );
}
