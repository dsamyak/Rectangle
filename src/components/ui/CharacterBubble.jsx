import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CharacterBubble({ character, message, position = 'bottom-right' }) {
  const getAvatar = () => {
    switch (character) {
      case 'robo': return '/assets/images/robo.png';
      case 'sarah': return '/assets/images/sarah.png';
      case 'mike': return '/assets/images/mike.png';
      default: return '/assets/images/robo.png';
    }
  };

  const positions = {
    'bottom-right': 'bottom-24 right-4 md:right-10 flex-row-reverse',
    'bottom-left': 'bottom-24 left-4 md:left-10 flex-row',
    'center': 'bottom-1/3 left-1/2 -translate-x-1/2 flex-row',
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className={`fixed z-40 flex items-end gap-4 ${positions[position]}`}
        >
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/10 backdrop-blur-md shadow-glow border-2 border-white/20">
            <img src={getAvatar()} alt={character} className="w-full h-full object-cover" />
          </div>
          <div className="bg-white text-blue-deep px-6 py-4 rounded-2xl rounded-br-none shadow-card max-w-xs md:max-w-sm">
            <p className="font-display font-semibold text-lg">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
