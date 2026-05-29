import React from 'react';
import GameWorld from '../games/GameWorld';

export default function PlayPhase({ onComplete }) {
  return (
    <div className="play-phase">
      <GameWorld onComplete={onComplete} />
    </div>
  );
}
