import { useState } from 'react';

export function useScore() {
  const [score, setScore] = useState({ xp: 0, combo: 0, stars: {} });

  const addXp = (amount) => {
    setScore(s => ({ ...s, xp: s.xp + amount }));
  };

  const incrementCombo = () => {
    setScore(s => ({ ...s, combo: s.combo + 1 }));
  };

  const resetCombo = () => {
    setScore(s => ({ ...s, combo: 0 }));
  };

  const setStars = (level, stars) => {
    setScore(s => ({ ...s, stars: { ...s.stars, [level]: Math.max(s.stars[level] || 0, stars) } }));
  };

  return {
    score,
    addXp,
    incrementCombo,
    resetCombo,
    setStars,
  };
}
