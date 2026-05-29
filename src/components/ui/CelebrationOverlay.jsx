import React, { useEffect, useState } from 'react';

export default function CelebrationOverlay({ onComplete }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#ffc107', '#4caf50', '#ef5350', '#3f51b5', '#7c5cbf'];
    const generated = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + 'vw',
      animationDuration: Math.random() * 3 + 2 + 's',
      animationDelay: Math.random() * 0.5 + 's',
      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
      width: Math.random() * 10 + 5 + 'px',
      height: Math.random() * 20 + 10 + 'px',
    }));
    setParticles(generated);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="confetti-container" onClick={onComplete}>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            backgroundColor: p.backgroundColor,
            width: p.width,
            height: p.height
          }}
        />
      ))}
    </div>
  );
}
