import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  ArrowLeft,
  ArrowRight,
  Tree,
  Drop,
  Fire,
  Wind,
  Lightning,
  Check,
  Play
} from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

// Act configurations
const actConfigs = {
  1: {
    number: 1,
    title: 'The Fractured Veil',
    subtitle: 'The Liminal Opening',
    element: 'Earth',
    color: 'earth',
    colorClass: 'text-chroma-earth',
    borderClass: 'border-chroma-earth',
    bgClass: 'bg-chroma-earth/10',
    icon: Tree,
    quote: '"The veil does not tear slowly. It fractures — all at once — and the world you thought was solid reveals itself as a projection over something far older."',
    description: 'This is the act of activation — the moment the matrix cracks and the seeker sees, without the ability to unsee, that the constructed reality they were living inside was never reality at all. Earth governs this threshold because the fracture is always a ground-level event.',
    reflectionProtocol: [
      'What inherited belief about yourself feels most like a cage right now?',
      'Where in your life are you performing a script written by someone else?',
      'What truth have you known for years that you have refused to act on?',
      'Who profits from you staying exactly where you are?'
    ],
    seekerEcho: 'The Seeker, too, began here — feeling the weight of energies that didn\'t belong to him, yet shaped his every movement. His first act of power was not transformation. It was recognition. Naming the fracture is not defeat. It is the first sovereign act.',
    keys: [
      {
        station: 'The Groundless',
        title: 'Written Before Time',
        type: 'light',
        content: 'Pure Akashic record encoding. The soul\'s blueprint preceded material existence. What the seeker is experiencing is not catastrophic deviation from the plan. It is the plan executing itself at a frequency the constructed self was never equipped to perceive.',
        extract: 'The Dark Night was written into the blueprint before you arrived in this body. You have not fallen off course. You have reached the coordinate that required the fracture. The ground you lost was never the real ground. Stop trying to rebuild what broke. Go deeper. The real foundation has been waiting for you to lose the floor so you could find it.'
      },
      {
        station: 'The Reckoning',
        title: 'Bought Low',
        type: 'shadow',
        content: 'The fracture of the veil reveals not just the spiritual deception but the material one. In the liminal space following activation, the seeker sees the economic record clearly for the first time.',
        extract: 'Grieve the extraction without letting the grief become the identity. The record shows you what was taken. It also shows you that the valuation is now yours to set. Know the number. Know what it was really worth.'
      },
      {
        station: 'The Speaking Root',
        title: 'I Create As I Speak',
        type: 'light',
        content: 'The counter-code to Bought Low. Where Bought Low names the extraction, I Create As I Speak names the sovereign creative principle that the extraction was always trying to suppress.',
        extract: 'What you are speaking into the atmosphere of your life right now is being organized into material form. The veil fractured so that you could see both the shadow of what was extracted and the light of what you carry. You create as you speak. Begin speaking accordingly.'
      }
    ]
  },
  2: {
    number: 2,
    title: 'Reclamation',
    subtitle: 'The Burning & The Sovereign Return',
    element: 'Fire',
    color: 'fire',
    colorClass: 'text-chroma-fire',
    borderClass: 'border-chroma-fire',
    bgClass: 'bg-chroma-fire/10',
    icon: Fire,
    quote: '"Fire does not ask permission. It does not negotiate. It consumes what is not essential and reveals what is — and what remains in the ash is the only thing that was ever real."',
    description: 'Reclamation is the act of the fire doing its sovereign work across twenty-six movements — the most complete alchemical sequence in the Chroma Key series. The seeker who enters Key I is not the same being who exits Key XXVI.',
    reflectionProtocol: [
      'What have you been tolerating that you are no longer willing to tolerate?',
      'Where have you been negotiating for scraps of your own power?',
      'What would you build if you stopped waiting for external permission?',
      'Which relationships, habits, or environments are extracting more than they give?'
    ],
    seekerEcho: 'The Seeker\'s ignition came when he recognized the difference between compassion and sacrifice. He had been offering himself as fuel for others\' fires when he was born to carry his own flame. Reclamation is not selfishness. It is the prerequisite for every act of genuine service that follows.',
    stages: [
      { name: 'The Summoning', keys: '1–3', description: 'Fire calls. Identity declared. Names claimed.' },
      { name: 'The Forge', keys: '4–6', description: 'False self burns. Sovereign word. Root to bloom.' },
      { name: 'The Confrontation', keys: '7–11', description: 'Inversion. Sight cleared. Systems named.' },
      { name: 'The Liberation', keys: '12–15', description: 'Hermetic law. Creed broken. Chains dissolved.' },
      { name: 'The Architecture', keys: '16–18', description: 'Post-liberation. Navigation. The archive.' },
      { name: 'The Reckoning', keys: '19–22', description: 'Creator declared. Cost honored. Power retrieved.' },
      { name: 'The Evidence', keys: '23–25', description: 'Documented. Child healed. Fire sustained.' },
      { name: 'The Transmission', keys: '26', description: 'Gate closes. Teacher speaks. Spell cast.' }
    ],
    keys: [
      { station: 'The Summoned', title: 'This Is The Fire (Overture)', type: 'light', keyNum: 'I', content: 'Fire\'s overture does not introduce themes. It summons the frequency that will make everything else possible.', extract: 'You do not enter fire unprepared. The overture is the act of standing at the threshold, feeling the heat before you step through.' },
      { station: 'The Declared', title: 'Reclamation (The Day Musiq Matrix Came Back)', type: 'light', keyNum: 'II', content: 'The thesis and the timestamp simultaneously. Not Reclamation as concept but as event — a specific day, a documented arrival.', extract: 'Name the day of your return. That day is a coordinate in the record. Acknowledge it. Speak the date. Anchor the return.' },
      { station: 'The Named', title: 'Know Your Names', type: 'light', keyNum: 'III', content: 'In Hermetic tradition, knowing the true name of something grants authority over it. The plural — Names — is the code.', extract: 'Audit every name you carry in the fire\'s light. Release the assigned frequencies. Declare the earned ones.' },
      { station: 'The Patient Root', title: 'Flowers', type: 'light', keyNum: 'IV', content: 'The bloom appearing in Act II is not coincidence with the fire. The fire is what made it visible.', extract: 'The flower does not exist despite the fire. It exists because of everything that came before it, now illuminated.' },
      { station: 'The Consecrated', title: 'Consecrated', type: 'dual', keyNum: 'V', content: 'The shadow: the portrait of the false self. The light: what fire leaves when it burns the portrait.', extract: 'Burn the portrait in ceremony, not in anger. Honor the service of your constructed self. Then release it completely.' },
      { station: 'The Speaking Alchemist', title: 'Abracadabra (Bought Low)', type: 'dual', keyNum: 'VI', content: 'Abracadabra — from the Aramaic avra kadavra meaning I will create as I speak.', extract: 'Abracadabra is not a children\'s trick. It is ancient declaration of creative law. What you speak with conviction you create with consequence.' },
      { station: 'The Inverter', title: 'Flip It', type: 'light', keyNum: 'VII', content: 'What was obstacle becomes resource. What was weight becomes leverage.', extract: 'Name one force in your current circumstance that was designed to work against you. Now locate the inversion.' },
      { station: 'The Seer In Formation', title: 'In Plain Sight', type: 'light', keyNum: 'VIII', content: 'The fire has burned away enough of the obscuring material that what was always in plain sight is now simply visible.', extract: 'The fire does not hide anything. It illuminates. What it reveals was always there.' },
      { station: 'The Emergency Transmitter', title: 'Code Red', type: 'shadow', keyNum: 'IX', content: 'The most urgent transmission in the series — a forced breach through the Veil to engineer release for another consciousness.', extract: 'When you have done enough fire work to see clearly, you will begin to see others still inside constructions you recognized and survived.' },
      { station: 'The Namer', title: 'Demonic Schemes', type: 'shadow', keyNum: 'X', content: 'Fire names things plainly. The scheme survives only as long as the language around it remains polite.', extract: 'In Reclamation you no longer owe politeness to the mechanisms that diminished you. Name them plainly.' },
      { station: 'The Decryptor', title: 'Coded Open', type: 'dual', keyNum: 'XI', content: 'Coded is the shadow — something was encrypted. Open is the light — the revelation.', extract: 'The thing you cannot yet speak clearly is not absent from your awareness. It is still coded. The fire\'s work is decryption.' },
      { station: 'The Hermetic Correspondent', title: 'As Above, So Below', type: 'light', keyNum: 'XII', content: 'The central Hermetic axiom embodied rather than quoted.', extract: 'The law is not metaphor. What is operating internally is producing the external reality with mathematical precision.' },
      { station: 'The Boundary Keeper', title: 'Break Creed', type: 'shadow', keyNum: 'XIII', content: 'You cannot sit in my fire and call it your light.', extract: 'Your fire is not public domain. Your altar is not available to those who want the light without the cost that generated it.' },
      { station: 'The Liberated — THE APEX', title: 'Seer Broke Chains', type: 'light', keyNum: 'XIV', content: 'The structural apex of the entire Chroma Key series. At Key XIV — the exact midpoint — the liberation lands.', extract: 'Before you engage the mechanism, examine the premise. See first. Then move. In that order. Always in that order.' },
      { station: 'The Protocol Recognizes The Arrival', title: 'Matrix Protocol Online', type: 'structural', keyNum: 'XV', content: 'The interlude that marks the crossing of the apex threshold.', extract: 'The system responds to resonance, not request. You do not petition the gate open. You arrive at the frequency that trips the lock.' },
      { station: 'The Builder', title: 'Architect of the Aftermath', type: 'light', keyNum: 'XVI', content: 'Post-liberation the seeker faces a new kind of work — designing what comes after.', extract: 'The aftermath is not a passive condition. It is a design opportunity.' },
      { station: 'The Navigator', title: 'Adjacent (Reroute It)', type: 'shadow', keyNum: 'XVII', content: 'The Navigator operates in the liminal space beside the established channel.', extract: 'From inside the aftermath, locate the fork points that are still available.' },
      { station: 'The Archivist', title: 'The Witness', type: 'light', keyNum: 'XVIII', content: 'There is a structure behind the mirror that does not feel a thing. It recorded the glory and it recorded the guilt.', extract: 'That chill on your spine was not fear. That was a transmission from the archive.' },
      { station: 'The Sovereign Creator', title: 'Art! Official!', type: 'dual', keyNum: 'XIX', content: 'The exclamation marks are the light code.', extract: 'Stop defending authentic against artificial. Make the authentic so fully realized that the comparison never gets made.' },
      { station: 'The Witness of Cost', title: 'Remember The Price (When You Speak The Name)', type: 'light', keyNum: 'XX', content: 'The most human station in the entire arc — the acknowledgment that sovereignty was not free.', extract: 'Do not let the elevation make you forget what the elevation cost. Not as burden — as gratitude.' },
      { station: 'The Reclaimed', title: 'Blood Without Stains', type: 'dual', keyNum: 'XXI', content: 'The most complete power retrieval in the series.', extract: 'They never took your power. They borrowed your silence. The lease is up.' },
      { station: 'The Grateful Sovereign', title: 'Thank You For The Fire', type: 'light', keyNum: 'XXII', content: 'Gratitude at this station is not politeness — it is the final proof of transcendence.', extract: 'Find the thing that burned you hardest. Thank it. Not for the harm. For the refinement.' },
      { station: 'The Strategist', title: 'Whodini in Your House of Cards', type: 'shadow', keyNum: 'XXIII', content: 'Act II\'s fire gives the Strategist the authority to name every card out loud.', extract: 'You do not need their destruction to prove what you survived. The catalog is the report.' },
      { station: 'The Healed Child', title: 'Elemental Orchestra', type: 'light', keyNum: 'XXIV', content: 'The most vulnerable station — and the one that makes everything emotionally complete.', extract: 'The flowers you wanted from the hands that threw stones — plant them yourself.' },
      { station: 'The Sustained Fire', title: 'Fire In My Veins', type: 'dual', keyNum: 'XXV', content: 'Fire in My Veins is not the ignition. It is the confirmation of permanent internal temperature.', extract: 'The fire in your veins at this station is not temporary motivation. It is the permanent state.' },
      { station: 'The Teacher — Gate Closes', title: 'The Reclamation Spell', type: 'light', keyNum: 'XXVI', content: 'He forgot his name. He forgot his shape. But the code inside him never shut down.', extract: 'The spell is cast by living it. Not by performing sovereignty — by operating from it as the default frequency.' }
    ]
  },
  3: {
    number: 3,
    title: 'The Reflection Chamber',
    subtitle: 'Shadow Work & The Mirror',
    element: 'Water',
    color: 'water',
    colorClass: 'text-chroma-water',
    borderClass: 'border-chroma-water',
    bgClass: 'bg-chroma-water/10',
    icon: Drop,
    quote: '"The mirror does not flatter. The mirror does not judge. The mirror only shows what is present — and the seeker who can remain in front of it long enough to see clearly has done the hardest work there is."',
    description: 'The Reflection Chamber is the act of going deep into the self\'s waters — down into the depth where the shadow lives, where the wounds are stored, where the subconscious runs its programs beneath the threshold of ordinary awareness.',
    reflectionProtocol: [
      'What emotion do you consistently suppress, and whose voice told you to?',
      'Where have you confused loyalty to others with betrayal of yourself?',
      'What grief are you still carrying that you have never given a proper name?',
      'What would change in your life if you stopped performing strength?'
    ],
    seekerEcho: 'The Seeker walked naked into every storm because he had stopped pretending the storms weren\'t real. His reflection showed him nothing at first — only the faces of those he\'d saved. Learning to find his own face in the mirror was the most dangerous work he ever did.',
    keys: [
      {
        station: 'The Documenter',
        title: 'Whodini in Your House of Cards',
        type: 'shadow',
        content: 'The Reflection Chamber\'s deepest shadow code — the full forensic account of manipulation, infiltration, and psychological warfare documented in real time.',
        extract: 'Document everything. The mirror of Act III is not just internal reflection — it is the clear-eyed recording of what was actually done and by whom. The house of cards collapses the moment one person refuses to pretend it is a mansion.'
      }
    ]
  }
};

const ActPage = () => {
  const { actNumber } = useParams();
  const navigate = useNavigate();
  const { user, updateProgress } = useAuth();
  const [reflections, setReflections] = useState({});
  const [activeTab, setActiveTab] = useState('overview');

  const actNum = parseInt(actNumber);
  const act = actConfigs[actNum];

  useEffect(() => {
    if (actNum === 4 && !user?.is_admin) {
      navigate('/act/4');
      return;
    }
    // Block access to Act 3 (Reflection Chamber) if not unlocked (admins bypass)
    if (actNum === 3 && !user?.act3_unlocked && !user?.is_admin) {
      navigate('/dashboard');
      return;
    }
    if (!act) {
      navigate('/dashboard');
      return;
    }
    fetchReflections();
  }, [actNum, act, navigate, user]);

  const fetchReflections = async () => {
    try {
      const response = await axios.get(`/reflections/${actNum}`);
      setReflections(response.data.items || {});
    } catch (error) {
      console.error('Error fetching reflections:', error);
    }
  };

  const handleReflectionChange = async (index, checked) => {
    const itemId = `protocol_${index}`;
    try {
      await axios.put('/reflections', {
        act: actNum,
        item_id: itemId,
        checked
      });
      setReflections(prev => ({ ...prev, [itemId]: checked }));
    } catch (error) {
      console.error('Error updating reflection:', error);
    }
  };

  const handleCompleteAct = async () => {
    const completed = user?.completed_acts || [];
    if (!completed.includes(actNum)) {
      const newCompleted = [...completed, actNum].sort();
      const newLevel = Math.min(newCompleted.length + 1, 4);
      await updateProgress({
        completed_acts: newCompleted,
        level: newLevel,
        current_act: Math.min(actNum + 1, 4)
      });
    }
  };

  if (!act) return null;

  const Icon = act.icon;
  const nextAct = actNum < 3 ? actNum + 1 : null;
  const prevAct = actNum > 1 ? actNum - 1 : null;
  const isCompleted = user?.completed_acts?.includes(actNum);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-chroma-base/80 backdrop-blur-md border-b border-chroma-border-default">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" data-testid="back-to-dashboard">
                <Button variant="ghost" size="icon" className="text-chroma-text-muted hover:text-chroma-gold">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 flex items-center justify-center ${act.bgClass}`}>
                  <Icon size={20} className={act.colorClass} weight="duotone" />
                </div>
                <div>
                  <h1 className={`font-heading text-lg font-bold tracking-tight ${act.colorClass}`}>
                    ACT {act.number}
                  </h1>
                  <p className="mono-label text-[10px]">{act.element.toUpperCase()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {prevAct && (
                <Link to={`/act/${prevAct}`}>
                  <Button variant="ghost" size="sm" className="text-chroma-text-muted hover:text-chroma-gold">
                    <ArrowLeft size={16} className="mr-1" /> Act {prevAct}
                  </Button>
                </Link>
              )}
              {nextAct && (
                <Link to={`/act/${nextAct}`}>
                  <Button variant="ghost" size="sm" className="text-chroma-text-muted hover:text-chroma-gold">
                    Act {nextAct} <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className={`card-cyber border-t-2 ${act.borderClass} p-8`}>
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 flex-shrink-0 flex items-center justify-center ${act.bgClass}`}>
                <Icon size={40} className={act.colorClass} weight="duotone" />
              </div>
              <div className="flex-1">
                <div className="mono-label mb-2">{act.element.toUpperCase()} // CHROMA KEY ACT {act.number}</div>
                <h2 className="font-heading text-3xl sm:text-4xl font-bold text-chroma-text-primary tracking-tight uppercase mb-2">
                  {act.title}
                </h2>
                <p className={`font-heading text-lg ${act.colorClass}`}>{act.subtitle}</p>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 bg-chroma-earth/20 px-3 py-1 border border-chroma-earth/30">
                  <Check size={16} className="text-chroma-earth" />
                  <span className="mono-label text-chroma-earth text-[10px]">COMPLETED</span>
                </div>
              )}
            </div>
            <blockquote className="mt-6 text-chroma-text-secondary italic border-l-2 border-chroma-gold/30 pl-4">
              {act.quote}
            </blockquote>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-chroma-surface border border-chroma-border-default p-1 w-full justify-start">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-chroma-gold data-[state=active]:text-black font-mono text-xs uppercase tracking-wider"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="keys" 
                className="data-[state=active]:bg-chroma-gold data-[state=active]:text-black font-mono text-xs uppercase tracking-wider"
              >
                Keys ({act.keys?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="protocol" 
                className="data-[state=active]:bg-chroma-gold data-[state=active]:text-black font-mono text-xs uppercase tracking-wider"
              >
                Reflection Protocol
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Description */}
                <div className="lg:col-span-2 card-cyber p-6">
                  <h3 className="mono-label mb-4">The Threshold</h3>
                  <p className="text-chroma-text-primary leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Video Placeholder */}
                <div className="card-cyber p-6">
                  <h3 className="mono-label mb-4">Transmission</h3>
                  <div className="video-placeholder aspect-video flex items-center justify-center mb-4">
                    <div className="text-center z-10">
                      <div className={`w-12 h-12 border ${act.borderClass} flex items-center justify-center mx-auto mb-2`}>
                        <Play size={24} className={act.colorClass} />
                      </div>
                      <p className="mono-label text-[10px]">Act {act.number} Briefing</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seeker's Echo */}
              <div className="card-cyber p-6 border-l-2 border-l-chroma-gold">
                <h3 className="mono-label mb-4">The Seeker's Echo • Act {act.number}</h3>
                <p className="text-chroma-text-secondary italic">
                  {act.seekerEcho}
                </p>
              </div>

              {/* Stages for Act 3 */}
              {act.stages && (
                <div className="card-cyber p-6">
                  <h3 className="mono-label mb-6">The Seeker to Teacher Arc</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {act.stages.map((stage, index) => (
                      <div key={index} className="bg-chroma-surface p-4 border border-chroma-border-default">
                        <div className="mono-label text-chroma-fire text-[10px] mb-2">{index + 1}</div>
                        <h4 className="font-heading text-sm font-semibold text-chroma-text-primary mb-1">
                          {stage.name}
                        </h4>
                        <p className="mono-label text-[10px] text-chroma-text-muted mb-2">Keys {stage.keys}</p>
                        <p className="text-chroma-text-secondary text-xs">{stage.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Keys Tab */}
            <TabsContent value="keys" className="mt-6">
              <ScrollArea className="h-[600px]">
                <Accordion type="single" collapsible className="space-y-3">
                  {act.keys?.map((key, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`key-${index}`}
                      className="card-cyber border-none"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className={`w-10 h-10 flex items-center justify-center border ${
                            key.type === 'light' ? 'border-chroma-gold bg-chroma-gold/10' :
                            key.type === 'shadow' ? 'border-chroma-text-muted bg-chroma-surface' :
                            'border-chroma-water bg-chroma-water/10'
                          }`}>
                            <span className={`font-mono text-sm ${
                              key.type === 'light' ? 'text-chroma-gold' :
                              key.type === 'shadow' ? 'text-chroma-text-secondary' :
                              'text-chroma-water'
                            }`}>
                              {key.keyNum || (index + 1)}
                            </span>
                          </div>
                          <div>
                            <p className="mono-label text-[10px] mb-1">{key.station}</p>
                            <h4 className="font-heading text-lg font-semibold text-chroma-text-primary">
                              {key.title}
                            </h4>
                            <span className={`mono-label text-[10px] ${
                              key.type === 'light' ? 'text-chroma-gold' :
                              key.type === 'shadow' ? 'text-chroma-text-muted' :
                              'text-chroma-water'
                            }`}>
                              {key.type === 'dual' ? 'SHADOW + LIGHT' : key.type.toUpperCase()} CODE
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6">
                        <div className="ml-14 space-y-4">
                          <p className="text-chroma-text-primary">{key.content}</p>
                          <div className="bg-chroma-surface border-l-2 border-chroma-gold p-4">
                            <p className="mono-label text-[10px] mb-2">// Spiritual Data • Extract & Apply</p>
                            <p className="text-chroma-text-secondary text-sm">{key.extract}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </TabsContent>

            {/* Reflection Protocol Tab */}
            <TabsContent value="protocol" className="mt-6">
              <div className="card-cyber p-6">
                <h3 className="mono-label mb-6">Reflection Protocol • Act {act.number}</h3>
                <div className="space-y-4">
                  {act.reflectionProtocol.map((question, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-chroma-surface border border-chroma-border-default">
                      <Checkbox
                        id={`protocol-${index}`}
                        checked={reflections[`protocol_${index}`] || false}
                        onCheckedChange={(checked) => handleReflectionChange(index, checked)}
                        data-testid={`protocol-check-${index}`}
                        className="mt-1 border-chroma-border-default data-[state=checked]:bg-chroma-gold data-[state=checked]:border-chroma-gold"
                      />
                      <label
                        htmlFor={`protocol-${index}`}
                        className={`text-sm cursor-pointer flex-1 ${
                          reflections[`protocol_${index}`] ? 'text-chroma-gold' : 'text-chroma-text-primary'
                        }`}
                      >
                        {question}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Complete Act Button */}
                <div className="mt-8 pt-6 border-t border-chroma-border-default flex justify-between items-center">
                  <p className="text-chroma-text-muted text-sm">
                    {isCompleted ? 'You have completed this act.' : 'Mark this act as complete when ready.'}
                  </p>
                  <Button
                    onClick={handleCompleteAct}
                    disabled={isCompleted}
                    className={isCompleted ? 'bg-chroma-earth text-black' : 'btn-gold'}
                    data-testid="complete-act-btn"
                  >
                    {isCompleted ? (
                      <>
                        <Check size={18} className="mr-2" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Lightning size={18} className="mr-2" />
                        Complete Act {act.number}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default ActPage;
