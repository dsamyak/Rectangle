import React, { useState, useEffect } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { reflectNarration, completionNarration, REFLECT_QUESTIONS } from '../../utils/narration';
import CelebrationOverlay from '../ui/CelebrationOverlay';

export default function ReflectPhase({ onComplete, audioEnabled, playStats }) {
  const [step, setStep] = useState('teach'); // teach | confidence | certificate
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(null);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState(null);

  useEffect(() => {
    const handle = narrate(reflectNarration(), audioEnabled);
    return () => { if (handle?.cancel) handle.cancel(); stopNarration(); };
  }, [audioEnabled]);

  // ─── Teach the Mascot ───
  const handleTeachAnswer = (option) => {
    if (teachAnswered !== null) return;
    setTeachAnswered(option.correct ? 'correct' : 'wrong');
    if (option.correct) {
      sounds.correct();
      setTeachCorrect(c => c + 1);
    } else {
      sounds.wrong();
    }
    setTimeout(() => {
      setTeachAnswered(null);
      if (teachIdx + 1 >= REFLECT_QUESTIONS.length) {
        setStep('confidence');
      } else {
        setTeachIdx(i => i + 1);
      }
    }, 1200);
  };

  // ─── Confidence Check ───
  const handleConfidence = (level) => {
    setConfidence(level);
    sounds.click();
    setTimeout(() => {
      setStep('certificate');
      narrate(completionNarration(), audioEnabled);
      sounds.badge();
    }, 800);
  };

  // ─── Certificate ───
  if (step === 'certificate') {
    const totalXp = playStats?.xp || 0;
    const totalWorlds = playStats?.worldScores ? Object.keys(playStats.worldScores).length : 0;
    const totalStars = playStats?.worldScores
      ? Object.values(playStats.worldScores).reduce((sum, w) => sum + (w.stars || 0), 0)
      : 0;

    return (
      <div className="reflect-phase" style={{ justifyContent: 'center' }}>
        <CelebrationOverlay />
        <div className="certificate-card" style={{ zIndex: 10 }}>
          <div className="cert-badge">🏆</div>
          <h2 className="cert-title" style={{ color: 'var(--gold)' }}>Shape Hero!</h2>
          <p className="cert-subtitle">You learned all about rectangles today!</p>

          <div className="cert-stats">
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{totalXp}</div>
              <div className="cert-stat-label">XP Earned</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value" style={{ color: 'var(--green)' }}>{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
              <div className="cert-stat-label">Taught Robo</div>
            </div>
            <div className="cert-stat">
              <div className="cert-stat-value">⭐ {totalStars}</div>
              <div className="cert-stat-label">Stars</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 16, margin: '16px 0', textAlign: 'left' }}>
            <p style={{ fontWeight: 700, marginBottom: 8 }}>📐 Remember:</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A rectangle has <strong style={{ color: 'var(--gold)' }}>4 sides</strong> and <strong style={{ color: 'var(--gold)' }}>4 corners</strong>.
              <br />Opposite sides are always <strong style={{ color: 'var(--gold)' }}>equal</strong>!
            </p>
          </div>

          {confidence && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>
              Confidence: {confidence === 'high' ? '😄 Very confident!' : confidence === 'medium' ? '🙂 Getting there!' : '🤔 Still learning!'}
            </p>
          )}

          <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: 8 }}>
            🎮 Play Again
          </button>
        </div>

        {/* Mascot */}
        <div className="mascot-container" style={{ zIndex: 10, marginTop: 16 }}>
          <div className="mascot happy">🤖</div>
          <div className="speech-bubble">You are a Shape Hero today! Amazing work!</div>
        </div>
      </div>
    );
  }

  // ─── Confidence Check ───
  if (step === 'confidence') {
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <div className="reflect-label">🪞 Reflect</div>
          <div className="reflect-sublabel">How do you feel about rectangles?</div>
        </div>

        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot" style={{ width: 56, height: 56, fontSize: '1.6rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>How confident do you feel about rectangles?</div>
          </div>

          <div className="confidence-grid">
            {[
              { level: 'high', emoji: '😄', label: 'I can teach others!', color: '#4caf50' },
              { level: 'medium', emoji: '🙂', label: 'I understand most of it!', color: '#ffc107' },
              { level: 'low', emoji: '🤔', label: 'I need more practice.', color: '#ff7043' },
            ].map(opt => (
              <button key={opt.level}
                className={`confidence-btn ${confidence === opt.level ? 'selected' : ''}`}
                style={{ '--conf-color': opt.color }}
                onClick={() => handleConfidence(opt.level)}
              >
                <span className="confidence-emoji">{opt.emoji}</span>
                <span className="confidence-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Teach the Mascot ───
  const currentQ = REFLECT_QUESTIONS[teachIdx];

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <div className="reflect-label">🪞 Reflect</div>
        <div className="reflect-sublabel">Teach Robo what you learned!</div>
      </div>

      <div className="reflect-card">
        <div className="reflect-mascot-row">
          <div className="mascot thinking" style={{ width: 56, height: 56, fontSize: '1.6rem' }}>🤖</div>
          <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>
            Can you teach me? I forgot!
          </div>
        </div>

        <h3 className="reflect-card-title">
          <span style={{ marginRight: 8 }}>{currentQ.emoji}</span>
          {currentQ.question}
        </h3>

        <div className="reflect-options">
          {currentQ.options.map((opt, i) => (
            <button key={i}
              className={`reflect-option ${teachAnswered === 'correct' && opt.correct ? 'correct' : ''} ${teachAnswered === 'wrong' && !opt.correct ? 'wrong' : ''}`}
              onClick={() => handleTeachAnswer(opt)}
              disabled={teachAnswered !== null}
            >
              <span className="reflect-option-emoji">{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="reflect-progress">
          {REFLECT_QUESTIONS.map((_, i) => (
            <div key={i} className={`reflect-dot ${i < teachIdx ? 'done' : i === teachIdx ? 'active' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
