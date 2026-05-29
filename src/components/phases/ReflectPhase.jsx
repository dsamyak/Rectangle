import React, { useState, useEffect } from 'react';
import { narrate } from '../../utils/audio';
import { reflectNarration, completionNarration } from '../../utils/narration';
import CelebrationOverlay from '../ui/CelebrationOverlay';
import CharacterBubble from '../ui/CharacterBubble';
import { motion } from 'framer-motion';

export default function ReflectPhase({ onComplete }) {
  const [step, setStep] = useState('prompt'); // prompt | record | complete
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    narrate(reflectNarration());
  }, []);

  const handleRecord = () => {
    setRecording(true);
    // Mock recording
    setTimeout(() => {
      setRecording(false);
      setStep('complete');
      narrate(completionNarration());
    }, 3000);
  };

  if (step === 'complete') {
    return (
      <div className="reflect-phase">
        <CelebrationOverlay />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="certificate-card z-10"
        >
          <div className="cert-badge">🏆</div>
          <h2 className="cert-title text-gold">Shape Hero!</h2>
          <p className="cert-subtitle">You learned all about rectangles today!</p>
          <div className="bg-white/5 p-4 rounded-xl text-sm text-white/80">
            <p><strong>Remember:</strong></p>
            <p>A rectangle has 4 sides and 4 corners.</p>
            <p>Opposite sides are equal!</p>
          </div>
          <button className="btn btn-primary mt-6" onClick={() => window.location.reload()}>
            Play Again
          </button>
        </motion.div>
        <CharacterBubble character="robo" message="You are a Shape Hero today! Amazing work!" />
      </div>
    );
  }

  return (
    <div className="reflect-phase">
      <div className="reflect-card">
        <h2 className="text-2xl font-display text-white mb-6">What makes a rectangle special?</h2>
        
        <div className="flex flex-col gap-4">
          <button 
            className={`btn ${recording ? 'bg-red-500 text-white animate-pulse' : 'btn-secondary'}`}
            onClick={handleRecord}
            disabled={recording}
          >
            {recording ? 'Listening...' : '🎤 Tell Robo'}
          </button>
          {!recording && (
            <button className="btn btn-outline" onClick={() => { setStep('complete'); narrate(completionNarration()); }}>
              ✏️ Draw & Label (Skip Voice)
            </button>
          )}
        </div>
      </div>
      <CharacterBubble character="robo" message="Can you tell me — what makes a rectangle special? Use your own words!" />
    </div>
  );
}
