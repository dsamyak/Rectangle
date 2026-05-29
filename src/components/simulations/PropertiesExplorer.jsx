import React, { useState, useEffect } from 'react';
import { narrate } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';
import { motion } from 'framer-motion';

export default function PropertiesExplorer({ onComplete }) {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(120);

  useEffect(() => {
    narrate(simulateNarration('explorer'));
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-display text-white mb-8">Stretch the rectangle!</h3>
      
      <div className="relative w-full max-w-md h-64 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 mb-8 p-4">
        <motion.div 
          className="relative bg-gold/20 border-4 border-gold rounded-sm flex items-center justify-center"
          animate={{ width, height }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute -top-8 text-gold font-bold">{Math.round(width)} px</div>
          <div className="absolute -bottom-8 text-gold font-bold">{Math.round(width)} px</div>
          <div className="absolute -left-16 text-gold font-bold">{Math.round(height)} px</div>
          <div className="absolute -right-16 text-gold font-bold">{Math.round(height)} px</div>
        </motion.div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex flex-col items-center">
          <label className="text-sm text-white/60 mb-2">Width</label>
          <input type="range" min="100" max="300" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-32" />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-sm text-white/60 mb-2">Height</label>
          <input type="range" min="80" max="200" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-32" />
        </div>
      </div>

      <button onClick={onComplete} className="btn btn-primary">Check My Rectangle!</button>
    </div>
  );
}
