import React from 'react';
import { usePhase } from './hooks/usePhase';
import PhaseBar from './components/ui/PhaseBar';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { currentPhase, phaseProgress, advancePhase } = usePhase();

  const renderPhase = () => {
    switch (currentPhase) {
      case 'wonder': return <WonderPhase key="wonder" onComplete={advancePhase} />;
      case 'story': return <StoryPhase key="story" onComplete={advancePhase} />;
      case 'simulate': return <SimulatePhase key="simulate" onComplete={advancePhase} />;
      case 'play': return <PlayPhase key="play" onComplete={advancePhase} />;
      case 'reflect': return <ReflectPhase key="reflect" onComplete={advancePhase} />;
      default: return null;
    }
  };

  return (
    <div className="app-container relative w-full h-screen overflow-hidden">
      <header className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-center">
        <PhaseBar currentPhase={currentPhase} phaseProgress={phaseProgress} />
      </header>
      
      <main className="w-full h-full pt-20 pb-24 flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full flex justify-center items-center"
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
