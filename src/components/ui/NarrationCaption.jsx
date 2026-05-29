import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NarrationCaption({ text }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000); // auto-hide after 5s or when text changes
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <AnimatePresence>
      {visible && text && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center h-20"
        >
          <p className="text-white text-xl md:text-2xl font-bold text-center max-w-4xl font-display">
            {text}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
