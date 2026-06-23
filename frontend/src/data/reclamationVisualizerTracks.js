export const RECLAMATION_VISUALIZER_TRACKS = [
  {
    id: 1,
    order: 1,
    title: 'Welcome To The Fire',
    subtitle: 'Act Three Overture',
    chamber: 'Fire Chamber',
    videoSrc: '/media/reclamation/01-welcome-to-the-fire.mp4',
    audioSrc: '/media/reclamation/01-welcome-to-the-fire.mp3',
    artifact: 'Ignition sequence. The mainframe opens with controlled combustion.',
    universityCode: 'Primary Light Code: Enter the fire without surrendering the self.',
    lyrics: [
      { start: 0, end: 7, text: 'Welcome to the fire.' },
      { start: 7, end: 15, text: 'The chamber opens when the signal returns.' },
      { start: 15, end: 24, text: 'Every cycle comes again, but this time I remember the code.' },
      { start: 24, end: 35, text: 'Only light breaks shadow chains.' }
    ]
  },
  {
    id: 2,
    order: 2,
    title: 'Reclamation',
    subtitle: 'The Day Musiq Matrix Came Back',
    chamber: 'Fire Chamber',
    videoSrc: '/media/reclamation/02-reclamation.mp4',
    audioSrc: '/media/reclamation/02-reclamation.mp3',
    artifact: 'Return signal. Identity, authorship, and sovereign claim restored.',
    universityCode: 'Primary Light Code: What was buried becomes architecture.',
    lyrics: [
      { start: 0, end: 8, text: 'This is reclamation.' },
      { start: 8, end: 18, text: 'The day Musiq Matrix came back.' },
      { start: 18, end: 29, text: 'What was buried becomes architecture.' },
      { start: 29, end: 43, text: 'I did not return empty. I returned encoded.' }
    ]
  },
  {
    id: 3,
    order: 3,
    title: 'Know Your Names',
    chamber: 'Exposure Chamber',
    videoSrc: '/media/reclamation/03-know-your-names.mp4',
    audioSrc: '/media/reclamation/03-know-your-names.mp3',
    artifact: 'Witness archive. Names, patterns, and hidden structures surface.',
    universityCode: 'Primary Light Code: Naming is not revenge. Naming is jurisdiction.',
    lyrics: [
      { start: 0, end: 9, text: 'I know your names.' },
      { start: 9, end: 20, text: 'Every hidden hand left a print inside the archive.' },
      { start: 20, end: 32, text: 'Truth does not need volume when the record is complete.' }
    ]
  },
  {
    id: 4,
    order: 4,
    title: 'Hold On',
    chamber: 'Reflection Chamber',
    videoSrc: '/media/reclamation/04-hold-on.mp4',
    audioSrc: '/media/reclamation/04-hold-on.mp3',
    artifact: 'Endurance field. The signal remains intact under pressure.',
    universityCode: 'Primary Light Code: Delay is not denial when the root is alive.',
    lyrics: [
      { start: 0, end: 10, text: 'Hold on through the burial.' },
      { start: 10, end: 23, text: 'The seed does not panic underground.' },
      { start: 23, end: 36, text: 'Storms do not cancel the lighthouse.' }
    ]
  },
  {
    id: 5,
    order: 5,
    title: 'Demonic Schemes',
    chamber: 'Exposure Chamber',
    videoSrc: '/media/reclamation/05-demonic-schemes.mp4',
    audioSrc: '/media/reclamation/05-demonic-schemes.mp3',
    artifact: 'Exposure protocol. Corruption cannot survive clean illumination.',
    universityCode: 'Primary Light Code: Discernment is the firewall.',
    lyrics: []
  },
  {
    id: 6,
    order: 6,
    title: 'Second Edition',
    chamber: 'Fire Chamber',
    videoSrc: '/media/reclamation/06-second-edition.mp4',
    audioSrc: '/media/reclamation/06-second-edition.mp3',
    artifact: 'Revision engine. The first draft was survival. The second is command.',
    universityCode: 'Primary Light Code: A rewrite can be a resurrection.',
    lyrics: []
  },
  {
    id: 7,
    order: 7,
    title: 'Thought Form',
    chamber: 'Reflection Chamber',
    videoSrc: '/media/reclamation/07-thought-form.mp4',
    audioSrc: '/media/reclamation/07-thought-form.mp3',
    artifact: 'Manifestation chamber. Pattern, word, and matter converge.',
    universityCode: 'Primary Light Code: Language is a construction material.',
    lyrics: []
  },
  {
    id: 8,
    order: 8,
    title: 'Remember the Price',
    subtitle: 'When You Speak The Name',
    chamber: 'Reflection Chamber',
    videoSrc: '/media/reclamation/08-remember-the-price.mp4',
    audioSrc: '/media/reclamation/08-remember-the-price.mp3',
    artifact: 'Cost ledger. The name carries weight because the passage had weight.',
    universityCode: 'Primary Light Code: Honor the cost before invoking the crown.',
    lyrics: []
  }
];

export function getVisualizerTrack(trackId) {
  return RECLAMATION_VISUALIZER_TRACKS.find((track) => track.id === trackId) || RECLAMATION_VISUALIZER_TRACKS[0];
}
