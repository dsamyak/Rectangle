import React, { useState, useEffect } from 'react';
import { narrate } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';

export default function RealWorldSpotter({ onComplete }) {
  const [found, setFound] = useState([]);
  
  const objects = [
    { id: 'door', label: 'Door', rect: { x: '10%', y: '20%', w: '15%', h: '60%' } },
    { id: 'window', label: 'Window', rect: { x: '40%', y: '15%', w: '25%', h: '35%' } },
    { id: 'book', label: 'Book', rect: { x: '75%', y: '50%', w: '10%', h: '12%' } },
    { id: 'poster', label: 'Poster', rect: { x: '80%', y: '15%', w: '12%', h: '25%' } }
  ];

  useEffect(() => {
    narrate(simulateNarration('spotter'));
  }, []);

  const handleClick = (id) => {
    if (!found.includes(id)) {
      const newFound = [...found, id];
      setFound(newFound);
      if (newFound.length === objects.length) {
        setTimeout(onComplete, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <h3 className="text-2xl font-display text-white mb-2">Can you find all the rectangles?</h3>
      <p className="text-gold mb-4">Found: {found.length} / {objects.length}</p>
      
      <div className="relative w-full aspect-video bg-white/10 rounded-xl overflow-hidden border border-white/20">
        <img src="/assets/images/classroom.png" alt="Classroom" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        
        {objects.map(obj => {
          const isFound = found.includes(obj.id);
          return (
            <div
              key={obj.id}
              onClick={() => handleClick(obj.id)}
              className={`absolute cursor-pointer border-4 transition-all duration-300 ${isFound ? 'border-green bg-green/20' : 'border-transparent hover:border-gold/50 hover:bg-gold/10'}`}
              style={{ left: obj.rect.x, top: obj.rect.y, width: obj.rect.w, height: obj.rect.h }}
            >
              {isFound && <div className="absolute inset-0 animate-pulse-glow" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
