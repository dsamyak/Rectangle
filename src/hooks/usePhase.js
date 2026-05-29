import { useState } from 'react';

export const PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];

export function usePhase() {
  const [currentPhase, setCurrentPhase] = useState('wonder');
  const [phaseProgress, setPhaseProgress] = useState({
    wonder: 'idle',     // idle | active | complete
    story: 'idle',
    simulate: 'idle',
    play: 'idle',
    reflect: 'idle',
  });

  const advancePhase = () => {
    const idx = PHASES.indexOf(currentPhase);
    setPhaseProgress(p => ({ ...p, [currentPhase]: 'complete' }));
    if (idx < PHASES.length - 1) {
      const nextPhase = PHASES[idx + 1];
      setCurrentPhase(nextPhase);
      setPhaseProgress(p => ({ ...p, [nextPhase]: 'active' }));
    }
  };

  const setProgress = (phase, status) => {
    setPhaseProgress(p => ({ ...p, [phase]: status }));
  };

  return {
    currentPhase,
    setCurrentPhase,
    phaseProgress,
    setProgress,
    advancePhase,
  };
}
