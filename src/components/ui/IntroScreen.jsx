import React from 'react';

const JOURNEY = [
  { icon: '✨', label: 'Wonder', desc: 'Discover the mystery' },
  { icon: '📖', label: 'Story', desc: 'Learn through a tale' },
  { icon: '🔬', label: 'Simulate', desc: 'Hands-on activities' },
  { icon: '🎮', label: 'Play', desc: 'Quiz challenges' },
  { icon: '🪞', label: 'Reflect', desc: 'Show what you know' },
];

export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <div className="intro-badge">📐 Grade 1 Mathematics</div>
      <h1 className="intro-title">Rectangles!</h1>
      <p className="intro-desc">
        Discover the shape that is hiding everywhere — in doors, windows, books, and more!
        Learn what makes a rectangle special and become a Shape Hero!
      </p>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🔢</div>
          <div className="feature-card-label">4 Sides</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">📐</div>
          <div className="feature-card-label">4 Corners</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">↔️</div>
          <div className="feature-card-label">Equal Opposites</div>
        </div>
      </div>

      <div className="intro-journey-map">
        <div className="intro-journey-title">🗺️ Your Learning Journey</div>
        <div className="intro-journey-steps">
          {JOURNEY.map((step, i) => (
            <React.Fragment key={i}>
              <div className="intro-journey-step">
                <div className="intro-journey-icon">{step.icon}</div>
                <div className="intro-journey-info">
                  <div className="intro-journey-label">{step.label}</div>
                  <div className="intro-journey-desc">{step.desc}</div>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="intro-journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={onStart}>
        🚀 Start Learning!
      </button>
    </div>
  );
}
