import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionCard({ question, onAnswer, number, total }) {
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, correct, wrong

  useEffect(() => {
    setSelected(null);
    setStatus('idle');
  }, [question]);

  const handleSelect = (option) => {
    if (status !== 'idle') return;
    setSelected(option);
    
    const isCorrect = option === question.correct;
    setStatus(isCorrect ? 'correct' : 'wrong');
    onAnswer(option);
  };

  const getOptionClass = (option) => {
    if (status === 'idle') return selected === option ? 'selected' : '';
    if (option === question.correct) return 'correct';
    if (selected === option && status === 'wrong') return 'wrong';
    return 'disabled';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="glass-card w-full"
      >
        <div className="flex justify-between text-sm text-white/50 mb-4">
          <span>Question {number} of {total}</span>
        </div>
        
        <h3 className="question-text text-white">{question.question}</h3>

        {question.options && (
          <div className="options-grid">
            {question.options.map((opt, i) => (
              <button 
                key={i}
                className={`option-btn ${getOptionClass(opt)}`}
                onClick={() => handleSelect(opt)}
                disabled={status !== 'idle'}
              >
                {opt.toString()}
              </button>
            ))}
          </div>
        )}

        {question.shapes && (
          <div className="options-grid">
            {question.shapes.map((s, i) => (
              <button 
                key={i}
                className={`option-btn flex justify-center py-8 ${getOptionClass(s)}`}
                onClick={() => handleSelect(s)}
                disabled={status !== 'idle'}
              >
                {/* Render simple shape based on string */}
                <div className="opacity-80">
                  {s.includes('rect') ? <div className={`bg-white ${s.includes('wide') ? 'w-16 h-8' : s.includes('tall') ? 'w-8 h-16' : 'w-12 h-12'}`} /> : null}
                  {s.includes('circle') ? <div className="bg-white w-12 h-12 rounded-full" /> : null}
                  {s.includes('triangle') ? <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[32px] border-b-white" /> : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
