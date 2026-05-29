import React, { useState, useEffect, useMemo } from 'react';
import { narrate, stopNarration, preloadNarration } from '../../utils/audio';
import { wonderNarration, WONDER_QUESTIONS } from '../../utils/narration';

const PARTICLES = ['▬', '▭', '▯', '◻', '▢', '📐', '📏', '🔲'];

export default function WonderPhase({ onComplete, audioEnabled }) {
  const [stage, setStage] = useState(0); // 0=intro, 1=question, 2=ready
  const [questionRevealed, setQuestionRevealed] = useState(false);

  const question = useMemo(() =>
    WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]
  , []);

  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      char: PARTICLES[Math.floor(Math.random() * PARTICLES.length)],
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${1.5 + Math.random() * 2}rem`,
    }))
  , []);

  useEffect(() => {
    const segments = wonderNarration();
    preloadNarration(segments);

    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => {
      setQuestionRevealed(true);
      setStage(2);
    }, 2000);

    const handle = narrate(segments, audioEnabled);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (handle?.cancel) handle.cancel();
      stopNarration();
    };
  }, [audioEnabled]);

  return (
    <div className="wonder-phase">
      {/* Floating particles */}
      <div className="wonder-particles">
        {particles.map((p, i) => (
          <span key={i} className="wonder-particle" style={{
            left: p.left, top: p.top,
            animationDelay: p.delay, fontSize: p.size,
          }}>
            {p.char}
          </span>
        ))}
      </div>

      <div className="wonder-content">
        {/* Mystery mark */}
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <div className="wonder-qmark-glow" />
          <span className="wonder-qmark-icon">?</span>
        </div>

        {/* Mascot */}
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot-container">
            <div className="mascot">🤖</div>
            <div className="speech-bubble wonder-bubble">
              There is a secret shape hiding everywhere!
            </div>
          </div>
        </div>

        {/* Question card */}
        <div className={`wonder-question-card ${questionRevealed ? 'visible' : ''}`}>
          <div className="wonder-emoji">{question.emoji}</div>
          <p className="wonder-question-text">{question.question}</p>
          <p className="wonder-subtext">{question.sub}</p>
        </div>

        {/* Discover button */}
        <button
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={onComplete}
        >
          <span className="wonder-btn-sparkle">✨</span>
          Discover Rectangles!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
