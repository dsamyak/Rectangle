import React, { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { playNarration } from '../../utils/narration';
import { generateSessionQuestions } from '../../utils/questionBank';
import QuestionRenderer from '../ui/QuestionRenderer';
import CelebrationOverlay from '../ui/CelebrationOverlay';

const WORLDS = [
  { name: 'Classroom', icon: '🏫', color: '#6366f1', desc: 'Counting sides' },
  { name: 'Playground', icon: '🎡', color: '#8b5cf6', desc: 'Counting corners' },
  { name: 'Library', icon: '📚', color: '#a855f7', desc: 'True or False' },
  { name: 'Art Room', icon: '🎨', color: '#d946ef', desc: 'Real world shapes' },
  { name: 'Kitchen', icon: '🍳', color: '#ec4899', desc: 'Fill the blank' },
  { name: 'Garden', icon: '🌻', color: '#f43f5e', desc: 'Odd one out' },
  { name: 'City', icon: '🏙️', color: '#f97316', desc: 'Shape detective' },
  { name: 'Space', icon: '🚀', color: '#eab308', desc: 'Compare shapes' },
  { name: 'Ocean', icon: '🌊', color: '#14b8a6', desc: 'Spot it!' },
  { name: 'Castle', icon: '🏰', color: '#22c55e', desc: 'Rectangle Master' },
];

const QS_PER_WORLD = 10;

export default function PlayPhase({ onComplete, audioEnabled }) {
  const [allQuestions] = useState(() => generateSessionQuestions());
  const [currentWorld, setCurrentWorld] = useState(null);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [xp, setXp] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [worldScores, setWorldScores] = useState({});
  const [worldCorrect, setWorldCorrect] = useState(0);
  const [showWorldComplete, setShowWorldComplete] = useState(false);
  const [showXpPopup, setShowXpPopup] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [hint, setHint] = useState(null);
  const feedbackTimer = useRef(null);

  const highestUnlocked = Object.keys(worldScores).length;

  const worldQuestions = currentWorld !== null
    ? allQuestions.slice(currentWorld * QS_PER_WORLD, (currentWorld + 1) * QS_PER_WORLD)
    : [];

  const handleAnswer = useCallback((isCorrect) => {
    setDisabled(true);
    setHint(null);

    if (isCorrect) {
      const streakBonus = streak >= 2 ? 5 : 0;
      const earned = 10 + streakBonus;
      setXp(x => x + earned);
      setStreak(s => s + 1);
      setWorldCorrect(c => c + 1);
      sounds.correct();
      if (streak >= 2) sounds.streak();
      setShowXpPopup(earned);
      setFeedback({ type: 'correct', message: 'Correct!', emoji: '🎉', sub: worldQuestions[questionIdx]?.explanation || 'Great job!' });
    } else {
      setStreak(0);
      setLives(l => Math.max(0, l - 1));
      sounds.wrong();
      setFeedback({ type: 'wrong', message: 'Not quite!', emoji: '🤔', sub: worldQuestions[questionIdx]?.explanation || 'Try the next one!' });
    }

    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
      setShowXpPopup(null);
      if (questionIdx + 1 >= worldQuestions.length) {
        // World complete
        const stars = worldCorrect >= 8 ? 3 : worldCorrect >= 5 ? 2 : 1;
        setWorldScores(prev => ({ ...prev, [currentWorld]: { correct: worldCorrect + (isCorrect ? 1 : 0), stars } }));
        setShowWorldComplete(true);
        sounds.badge();
      } else {
        setQuestionIdx(qi => qi + 1);
        setDisabled(false);
      }
    }, 1800);
  }, [questionIdx, streak, worldQuestions, worldCorrect, currentWorld]);

  const handleWorldSelect = (worldIdx) => {
    if (worldIdx > highestUnlocked) return;
    setCurrentWorld(worldIdx);
    setQuestionIdx(0);
    setWorldCorrect(0);
    setLives(3);
    setStreak(0);
    setDisabled(false);
    setShowWorldComplete(false);
    setFeedback(null);
    setHint(null);
  };

  const handleWorldCompleteNext = () => {
    setShowWorldComplete(false);
    if (currentWorld >= 9) {
      onComplete({ xp, worldScores });
    } else {
      setCurrentWorld(null);
    }
  };

  // ─── World Map ───
  if (currentWorld === null) {
    return (
      <div className="play-phase">
        <div className="play-header">
          <h2 className="play-title">🗺️ Rectangle Worlds</h2>
          <p className="play-subtitle">Complete challenges in each world!</p>
          <div className="play-xp-badge">⭐ {xp} XP</div>
        </div>
        <div className="world-map">
          {WORLDS.map((world, i) => {
            const isUnlocked = i <= highestUnlocked;
            const isCompleted = worldScores[i];
            return (
              <div key={i}
                className={`world-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                style={{ '--world-color': world.color }}
                onClick={() => isUnlocked && handleWorldSelect(i)}
              >
                {!isUnlocked && <span className="world-lock">🔒</span>}
                <span className="world-icon">{world.icon}</span>
                <span className="world-name">{world.name}</span>
                <span className="world-desc">{world.desc}</span>
                {isCompleted && (
                  <div className="world-stars">
                    {[1,2,3].map(s => <span key={s} style={{ opacity: s <= isCompleted.stars ? 1 : 0.2 }}>⭐</span>)}
                    <span className="world-score">{isCompleted.correct}/{QS_PER_WORLD}</span>
                  </div>
                )}
                {isUnlocked && !isCompleted && (
                  <span className="world-play-btn" style={{ background: world.color }}>Play →</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── World Complete ───
  if (showWorldComplete) {
    const score = worldScores[currentWorld];
    const stars = score?.stars || 1;
    return (
      <div className="play-phase" style={{ justifyContent: 'center' }}>
        <CelebrationOverlay />
        <div className="world-complete-card" style={{ zIndex: 10 }}>
          <div className="world-complete-icon">{WORLDS[currentWorld].icon}</div>
          <h2 className="world-complete-title">{WORLDS[currentWorld].name} Complete!</h2>
          <div className="world-complete-stars">
            {[1,2,3].map(s => (
              <span key={s} className={`world-star ${s <= stars ? 'earned' : ''}`}
                style={s <= stars ? { animationDelay: `${s * 0.2}s` } : {}}>⭐</span>
            ))}
          </div>
          <div className="world-complete-score">{score?.correct || 0}/{QS_PER_WORLD}</div>
          <p className="world-complete-xp">+{(score?.correct || 0) * 10} XP earned!</p>
          <button className="btn btn-primary" onClick={handleWorldCompleteNext} style={{ marginTop: 16 }}>
            {currentWorld >= 9 ? '🏆 Finish!' : '🗺️ Back to Map'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Question View ───
  const question = worldQuestions[questionIdx];
  if (!question) return null;

  return (
    <div className="play-phase">
      {/* XP Popup */}
      {showXpPopup && <div className="xp-popup">+{showXpPopup} XP</div>}

      {/* Feedback overlay */}
      {feedback && (
        <div className="feedback-overlay" onClick={() => {}}>
          <div className={`feedback-content ${feedback.type}`}>
            <div className="feedback-emoji">{feedback.emoji}</div>
            <div className="feedback-message">{feedback.message}</div>
            <div className="feedback-sub">{feedback.sub}</div>
          </div>
        </div>
      )}

      {/* World badge */}
      <div className="play-world-badge" style={{ background: WORLDS[currentWorld].color }}>
        {WORLDS[currentWorld].icon} {WORLDS[currentWorld].name}
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-item">
          <div className="hearts">
            {[1,2,3].map(i => <span key={i} style={{ opacity: i <= lives ? 1 : 0.2 }}>❤️</span>)}
          </div>
        </div>
        <div className="hud-item" style={{ color: 'var(--gold)' }}>⭐ {xp}</div>
        <div className="hud-item">
          {streak >= 2 && <span className="streak-fire">🔥</span>}
          {streak >= 2 ? `${streak}x` : `Q${questionIdx + 1}/${QS_PER_WORLD}`}
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar-container" style={{ maxWidth: 700, marginBottom: 16 }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${((questionIdx + 1) / QS_PER_WORLD) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="question-card">
        <QuestionRenderer question={question} onAnswer={handleAnswer} disabled={disabled} />

        {/* Hint button */}
        {!hint && !disabled && (
          <button style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setHint(question.hint1)}>
            💡 Need a hint?
          </button>
        )}
        {hint && <div className="hint-text">💡 {hint}</div>}
      </div>
    </div>
  );
}
