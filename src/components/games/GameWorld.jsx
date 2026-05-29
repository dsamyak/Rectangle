import React, { useState, useEffect } from 'react';
import { drawQuestions, QUESTION_BANK } from '../../utils/questions';
import { narrate } from '../../utils/audio';
import { playNarration } from '../../utils/narration';
import QuestionCard from './QuestionCard';
import { useScore } from '../../hooks/useScore';
import CelebrationOverlay from '../ui/CelebrationOverlay';

export default function GameWorld({ onComplete }) {
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const { score, addXp, incrementCombo, resetCombo, setStars } = useScore();

  useEffect(() => {
    setQuestions(drawQuestions(QUESTION_BANK, 5));
    setCurrentQ(0);
  }, [level]);

  const handleAnswer = (answer) => {
    const q = questions[currentQ];
    const isCorrect = answer === q.correct;

    if (isCorrect) {
      const xp = score.combo >= 2 ? 15 : 10;
      addXp(xp);
      incrementCombo();
      narrate([playNarration().correct]);
    } else {
      resetCombo();
      narrate([playNarration().wrong]);
    }

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        finishLevel(isCorrect);
      } else {
        setCurrentQ(c => c + 1);
      }
    }, 1500);
  };

  const finishLevel = (lastCorrect) => {
    setStars(level, 3); // simplistic scoring for now
    setShowLevelComplete(true);
    narrate([playNarration().levelUp]);
  };

  const nextLevel = () => {
    setShowLevelComplete(false);
    if (level >= 3) {
      onComplete();
    } else {
      setLevel(l => l + 1);
    }
  };

  if (showLevelComplete) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative">
        <CelebrationOverlay />
        <div className="world-complete-card z-10">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="world-complete-title text-white">Level {level} Complete!</h2>
          <p className="text-gold text-2xl font-bold my-4">+{score.xp} XP</p>
          <button className="btn btn-primary mt-4" onClick={nextLevel}>
            {level >= 3 ? "Finish Game" : "Next Level"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      <div className="flex justify-between w-full mb-6 text-white bg-white/10 px-6 py-2 rounded-full">
        <span className="font-bold">Level {level}</span>
        <span className="font-bold text-gold">{score.xp} XP</span>
        <span className="font-bold text-green-light">Combo {score.combo}x</span>
      </div>

      {questions.length > 0 && (
        <QuestionCard 
          question={questions[currentQ]} 
          onAnswer={handleAnswer} 
          number={currentQ + 1}
          total={questions.length}
        />
      )}
    </div>
  );
}
