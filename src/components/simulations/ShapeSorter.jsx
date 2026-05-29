import React, { useState, useEffect } from 'react';
import { narrate } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShapeSorter({ onComplete }) {
  const [shapes, setShapes] = useState([
    { id: 's1', isRect: true, label: 'Rect 1', color: '#ffc107', w: 80, h: 40 },
    { id: 's2', isRect: false, label: 'Tri 1', color: '#4caf50', type: 'tri' },
    { id: 's3', isRect: true, label: 'Square', color: '#3f51b5', w: 60, h: 60 },
    { id: 's4', isRect: false, label: 'Circ 1', color: '#ef5350', type: 'circle' }
  ]);
  
  const [draggedShape, setDraggedShape] = useState(null);
  const [buckets, setBuckets] = useState({ rect: [], other: [] });

  useEffect(() => {
    narrate(simulateNarration('sorter'));
  }, []);

  const handleDragStart = (e, shape) => {
    setDraggedShape(shape);
  };

  const handleDrop = (e, bucketType) => {
    e.preventDefault();
    if (!draggedShape) return;
    
    const isCorrectBucket = (bucketType === 'rect' && draggedShape.isRect) || (bucketType === 'other' && !draggedShape.isRect);
    
    if (isCorrectBucket) {
      setBuckets(prev => ({ ...prev, [bucketType]: [...prev[bucketType], draggedShape] }));
      setShapes(prev => prev.filter(s => s.id !== draggedShape.id));
      
      if (shapes.length === 1) {
        setTimeout(onComplete, 1000);
      }
    } else {
      // Wrong drop feedback could be handled with audio/animation
    }
    setDraggedShape(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const renderShape = (shape) => {
    if (shape.type === 'circle') return <div className="w-12 h-12 rounded-full" style={{ backgroundColor: shape.color }} />;
    if (shape.type === 'tri') return <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[40px]" style={{ borderBottomColor: shape.color }} />;
    return <div style={{ width: shape.w, height: shape.h, backgroundColor: shape.color }} className="rounded-sm" />;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h3 className="text-2xl font-display text-white mb-8">Sort the Shapes!</h3>
      
      <div className="flex gap-4 mb-12 min-h-[80px]">
        <AnimatePresence>
          {shapes.map(s => (
            <motion.div
              key={s.id}
              draggable
              onDragStart={(e) => handleDragStart(e, s)}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="cursor-grab hover:scale-110 transition-transform bg-white/10 p-4 rounded-lg"
            >
              {renderShape(s)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 w-full max-w-2xl">
        <div 
          className="flex-1 bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 min-h-[200px] flex flex-col items-center"
          onDrop={(e) => handleDrop(e, 'rect')}
          onDragOver={handleDragOver}
        >
          <h4 className="text-xl font-display text-gold mb-4">Rectangles</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {buckets.rect.map(s => <div key={s.id} className="opacity-70">{renderShape(s)}</div>)}
          </div>
        </div>
        <div 
          className="flex-1 bg-white/5 border-2 border-dashed border-white/20 rounded-xl p-6 min-h-[200px] flex flex-col items-center"
          onDrop={(e) => handleDrop(e, 'other')}
          onDragOver={handleDragOver}
        >
          <h4 className="text-xl font-display text-white/70 mb-4">Not Rectangles</h4>
          <div className="flex flex-wrap gap-2 justify-center">
            {buckets.other.map(s => <div key={s.id} className="opacity-70">{renderShape(s)}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
