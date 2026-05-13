import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Wind } from '@phosphor-icons/react';
import { Button } from '../components/ui/button';

const LockedAct = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-chroma-base/80 backdrop-blur-md border-b border-chroma-border-default">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/launchmodule" data-testid="back-to-launchmodule">
              <Button variant="ghost" size="icon" className="text-chroma-text-muted hover:text-chroma-gold">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="font-heading text-lg font-bold text-chroma-air tracking-tight">
                ACT IV
              </h1>
              <p className="mono-label text-[10px]">The Crucible Code</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Locked Icon */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 border-2 border-chroma-air/30 flex items-center justify-center">
              <Wind size={64} className="text-chroma-air/30" weight="duotone" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-chroma-base/60">
              <Lock size={40} className="text-chroma-air" weight="fill" />
            </div>
          </div>

          {/* Title */}
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-chroma-air tracking-tight uppercase mb-4">
            The Crucible Code
          </h2>
          <p className="mono-label mb-8">ELEMENT: AIR // STATUS: SEALED</p>

          {/* Description */}
          <div className="card-cyber border-t-2 border-t-chroma-air p-8 max-w-2xl mx-auto mb-8">
            <blockquote className="text-chroma-text-secondary italic text-lg mb-6">
              "This is not the defeat of the shadow. This is not the victory of the light. 
              This is the rare and sovereign state where both are given their holy function — 
              and the whole finally becomes navigable."
            </blockquote>

            <p className="text-chroma-text-primary mb-6">
              The Crucible Code is the act that completes the initiatory sequence — not with triumph 
              but with <span className="text-chroma-air font-semibold">integration</span>. The seeker 
              who broke through the veil, descended into the mirror, and moved through twenty-six keys 
              of fire does not arrive here as a being of pure light who has vanquished their darkness.
            </p>

            <p className="text-chroma-text-secondary">
              They arrive as a being who has developed sufficient psychological and spiritual 
              architecture to hold all of it — the masculine and the feminine, the god and the devil, 
              the lightning and the shadow — each in its proper place, each performing its specific 
              function in the total ecology of the human psyche.
            </p>
          </div>

          {/* Codex Status */}
          <div className="bg-chroma-surface border border-chroma-border-default p-6 max-w-lg mx-auto">
            <div className="mono-label text-chroma-air mb-2">CODEX STATUS</div>
            <h3 className="font-heading text-xl text-chroma-text-primary mb-4">
              The Keys of Act IV Remain Sealed
            </h3>
            <p className="text-chroma-text-muted text-sm mb-4">
              This Codex will be completed upon the release of Chroma Key Act IV: The Crucible Code. 
              The integration doctrine, the polarity Keys, and the full mapping of the achieved 
              equilibrium will be published at that threshold.
            </p>
            <div className="mono-label text-chroma-text-muted">
              Release Date • To Be Determined
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-12">
            <Link to="/launchmodule">
              <Button className="btn-gold" data-testid="return-launchmodule-btn">
                <ArrowLeft size={18} className="mr-2" />
                Return to Protocol
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LockedAct;
