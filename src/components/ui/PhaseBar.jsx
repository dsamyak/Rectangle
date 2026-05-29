import React from 'react';
import { PHASES } from '../../hooks/usePhase';
import { Check } from 'lucide-react';

export default function PhaseBar({ currentPhase, phaseProgress }) {
  return (
    <div className="journey-bar">
      {PHASES.map((phase, idx) => {
        const isPast = PHASES.indexOf(currentPhase) > idx;
        const isActive = currentPhase === phase;
        const isCompleted = phaseProgress[phase] === 'complete' || isPast;

        let statusClass = '';
        if (isActive) statusClass = 'active';
        else if (isCompleted) statusClass = 'completed';

        return (
          <React.Fragment key={phase}>
            <div className={`journey-step ${statusClass}`}>
              <div className="journey-step-dot">
                {isCompleted && !isActive ? <Check size={14} strokeWidth={4} /> : (idx + 1)}
              </div>
              <span className="journey-step-label ml-2 capitalize">{phase}</span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className={`journey-connector ${isCompleted ? 'filled' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
