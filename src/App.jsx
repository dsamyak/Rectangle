import React, { useState, useCallback } from 'react';
import FloatingShapes from './components/ui/FloatingShapes';
import IntroScreen from './components/ui/IntroScreen';
import WonderPhase from './components/phases/WonderPhase';
import StoryPhase from './components/phases/StoryPhase';
import SimulatePhase from './components/phases/SimulatePhase';
import PlayPhase from './components/phases/PlayPhase';
import ReflectPhase from './components/phases/ReflectPhase';

const PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];
const PHASE_LABELS = { wonder: 'Wonder', story: 'Story', simulate: 'Simulate', play: 'Play', reflect: 'Reflect' };
const PHASE_ICONS = { wonder: '✨', story: '📖', simulate: '🔬', play: '🎮', reflect: '🪞' };

export default function App() {
  const [started, setStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('wonder');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playStats, setPlayStats] = useState(null);

  const currentIdx = PHASES.indexOf(currentPhase);

  const advancePhase = useCallback((stats) => {
    const idx = PHASES.indexOf(currentPhase);
    if (currentPhase === 'play' && stats) {
      setPlayStats(stats);
    }
    if (idx < PHASES.length - 1) {
      setCurrentPhase(PHASES[idx + 1]);
    }
  }, [currentPhase]);

  const goHome = () => {
    setStarted(false);
    setCurrentPhase('wonder');
    setPlayStats(null);
  };

  // ─── Intro Screen ───
  if (!started) {
    return (
      <>
        <FloatingShapes />
        <div className="app-container">
          <IntroScreen onStart={() => setStarted(true)} />
        </div>
      </>
    );
  }

  // ─── Main App ───
  return (
    <>
      <FloatingShapes />

      {/* Audio toggle */}
      <button
        className="audio-toggle-btn"
        onClick={() => setAudioEnabled(a => !a)}
        title={audioEnabled ? 'Mute' : 'Unmute'}
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>

      {/* Home button */}
      <button className="home-btn" onClick={goHome}>
        🏠 Home
      </button>

      {/* Journey bar */}
      <div className="journey-bar">
        {PHASES.map((phase, idx) => {
          const isActive = phase === currentPhase;
          const isCompleted = idx < currentIdx;
          let statusClass = '';
          if (isActive) statusClass = 'active';
          else if (isCompleted) statusClass = 'completed';

          return (
            <React.Fragment key={phase}>
              <div className={`journey-step ${statusClass}`}>
                <div className="journey-step-dot">
                  {isCompleted ? '✓' : PHASE_ICONS[phase]}
                </div>
                <span className="journey-step-label">{PHASE_LABELS[phase]}</span>
              </div>
              {idx < PHASES.length - 1 && (
                <div className={`journey-connector ${isCompleted ? 'filled' : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Phase content */}
      <div className="app-container">
        {currentPhase === 'wonder' && (
          <WonderPhase onComplete={() => advancePhase()} audioEnabled={audioEnabled} />
        )}
        {currentPhase === 'story' && (
          <StoryPhase onComplete={() => advancePhase()} audioEnabled={audioEnabled} />
        )}
        {currentPhase === 'simulate' && (
          <SimulatePhase onComplete={() => advancePhase()} audioEnabled={audioEnabled} />
        )}
        {currentPhase === 'play' && (
          <PlayPhase onComplete={(stats) => advancePhase(stats)} audioEnabled={audioEnabled} />
        )}
        {currentPhase === 'reflect' && (
          <ReflectPhase onComplete={() => {}} audioEnabled={audioEnabled} playStats={playStats} />
        )}
      </div>
    </>
  );
}
