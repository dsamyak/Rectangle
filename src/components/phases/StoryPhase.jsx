import React, { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration, preloadNarration, say, emphasize } from '../../utils/audio';
import { STORY_SLIDES } from '../../utils/narration';

// SVG illustrations for each story slide
function StoryIllustration({ slideIndex }) {
  const illustrations = [
    // Slide 0: Classroom scene
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      <rect x="30" y="40" width="80" height="160" rx="4" fill="rgba(255,193,7,0.2)" stroke="#ffc107" strokeWidth="2" strokeDasharray="6,3" />
      <text x="70" y="125" textAnchor="middle" fill="#ffd54f" fontSize="12" fontWeight="600">DOOR</text>
      <rect x="140" y="50" width="100" height="70" rx="4" fill="rgba(99,102,241,0.2)" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6,3" />
      <text x="190" y="90" textAnchor="middle" fill="#a78bfa" fontSize="12" fontWeight="600">WINDOW</text>
      <rect x="270" y="60" width="60" height="80" rx="4" fill="rgba(76,175,80,0.2)" stroke="#4caf50" strokeWidth="2" strokeDasharray="6,3" />
      <text x="300" y="105" textAnchor="middle" fill="#81c784" fontSize="12" fontWeight="600">POSTER</text>
      <rect x="160" y="150" width="50" height="35" rx="3" fill="rgba(255,193,7,0.15)" stroke="#ffc107" strokeWidth="1.5" />
      <text x="185" y="172" textAnchor="middle" fill="#ffd54f" fontSize="9" fontWeight="600">BOOK</text>
      <text x="200" y="225" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="14" fontFamily="Fredoka">🎨 Art Day in the Classroom!</text>
    </svg>,
    // Slide 1: Picture frame - counting sides
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      <rect x="100" y="30" width="200" height="150" rx="6" fill="rgba(255,193,7,0.15)" stroke="#ffc107" strokeWidth="4" />
      <rect x="115" y="45" width="170" height="120" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="200" y="105" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="28">🖼️</text>
      {/* Side labels */}
      <text x="200" y="23" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">Side 1 →</text>
      <text x="200" y="198" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">← Side 3</text>
      <text x="82" y="110" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700" transform="rotate(-90, 82, 110)">Side 2 →</text>
      <text x="318" y="110" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700" transform="rotate(90, 318, 110)">Side 4 →</text>
      <circle cx="100" cy="30" r="6" fill="#ef5350" /><text x="100" y="34" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">1</text>
      <circle cx="300" cy="30" r="6" fill="#ef5350" /><text x="300" y="34" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">2</text>
      <circle cx="300" cy="180" r="6" fill="#ef5350" /><text x="300" y="184" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">3</text>
      <circle cx="100" cy="180" r="6" fill="#ef5350" /><text x="100" y="184" textAnchor="middle" fill="white" fontSize="8" fontWeight="700">4</text>
      <text x="200" y="228" textAnchor="middle" fill="var(--gold)" fontSize="16" fontWeight="700">1, 2, 3, 4 — Four sides!</text>
    </svg>,
    // Slide 2: Counting corners
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      <rect x="100" y="40" width="200" height="140" rx="6" fill="rgba(99,102,241,0.15)" stroke="#8b5cf6" strokeWidth="3" />
      {/* Corner highlights */}
      <circle cx="100" cy="40" r="16" fill="rgba(255,193,7,0.3)" stroke="#ffc107" strokeWidth="2"><animate attributeName="r" values="12;18;12" dur="1.5s" repeatCount="indefinite" /></circle>
      <text x="100" y="45" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">1</text>
      <circle cx="300" cy="40" r="16" fill="rgba(255,193,7,0.3)" stroke="#ffc107" strokeWidth="2"><animate attributeName="r" values="12;18;12" dur="1.5s" begin="0.3s" repeatCount="indefinite" /></circle>
      <text x="300" y="45" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">2</text>
      <circle cx="300" cy="180" r="16" fill="rgba(255,193,7,0.3)" stroke="#ffc107" strokeWidth="2"><animate attributeName="r" values="12;18;12" dur="1.5s" begin="0.6s" repeatCount="indefinite" /></circle>
      <text x="300" y="185" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">3</text>
      <circle cx="100" cy="180" r="16" fill="rgba(255,193,7,0.3)" stroke="#ffc107" strokeWidth="2"><animate attributeName="r" values="12;18;12" dur="1.5s" begin="0.9s" repeatCount="indefinite" /></circle>
      <text x="100" y="185" textAnchor="middle" fill="#ffc107" fontSize="14" fontWeight="700">4</text>
      <text x="200" y="120" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="16" fontWeight="600">Corners are where sides meet!</text>
      <text x="200" y="225" textAnchor="middle" fill="var(--gold)" fontSize="16" fontWeight="700">4 Corners!</text>
    </svg>,
    // Slide 3: Rectangles everywhere
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      {/* Door */}
      <rect x="20" y="40" width="70" height="130" rx="4" fill="rgba(255,193,7,0.2)" stroke="#ffc107" strokeWidth="2" />
      <circle cx="80" cy="105" r="4" fill="#ffc107" />
      <text x="55" y="190" textAnchor="middle" fill="#ffd54f" fontSize="11" fontWeight="600">🚪 Door</text>
      {/* Window */}
      <rect x="115" y="40" width="80" height="60" rx="4" fill="rgba(99,102,241,0.2)" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="155" y1="40" x2="155" y2="100" stroke="#8b5cf6" strokeWidth="1" />
      <line x1="115" y1="70" x2="195" y2="70" stroke="#8b5cf6" strokeWidth="1" />
      <text x="155" y="120" textAnchor="middle" fill="#a78bfa" fontSize="11" fontWeight="600">🪟 Window</text>
      {/* Book */}
      <rect x="220" y="50" width="50" height="70" rx="3" fill="rgba(76,175,80,0.2)" stroke="#4caf50" strokeWidth="2" />
      <line x1="225" y1="50" x2="225" y2="120" stroke="#4caf50" strokeWidth="2" />
      <text x="245" y="140" textAnchor="middle" fill="#81c784" fontSize="11" fontWeight="600">📖 Book</text>
      {/* Phone */}
      <rect x="300" y="45" width="40" height="70" rx="6" fill="rgba(239,83,80,0.2)" stroke="#ef5350" strokeWidth="2" />
      <rect x="305" y="55" width="30" height="45" rx="2" fill="rgba(255,255,255,0.05)" />
      <text x="320" y="135" textAnchor="middle" fill="#ef9a9a" fontSize="11" fontWeight="600">📱 Phone</text>
      {/* Whiteboard */}
      <rect x="110" y="150" width="180" height="60" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <text x="200" y="185" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontWeight="600">📋 Whiteboard</text>
      <text x="200" y="232" textAnchor="middle" fill="var(--gold)" fontSize="13" fontWeight="700">Rectangles are EVERYWHERE!</text>
    </svg>,
    // Slide 4: Opposite sides equal
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      <rect x="80" y="50" width="240" height="130" rx="6" fill="rgba(255,193,7,0.1)" stroke="#ffc107" strokeWidth="3" />
      {/* Top and bottom labels (same color = equal) */}
      <line x1="80" y1="42" x2="320" y2="42" stroke="#ef5350" strokeWidth="4" strokeLinecap="round" />
      <text x="200" y="36" textAnchor="middle" fill="#ef5350" fontSize="13" fontWeight="700">240 px</text>
      <line x1="80" y1="188" x2="320" y2="188" stroke="#ef5350" strokeWidth="4" strokeLinecap="round" />
      <text x="200" y="205" textAnchor="middle" fill="#ef5350" fontSize="13" fontWeight="700">240 px ✓ Same!</text>
      {/* Left and right labels (same color = equal) */}
      <line x1="72" y1="50" x2="72" y2="180" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" />
      <text x="50" y="120" textAnchor="middle" fill="#4caf50" fontSize="12" fontWeight="700" transform="rotate(-90,50,120)">130 px</text>
      <line x1="328" y1="50" x2="328" y2="180" stroke="#4caf50" strokeWidth="4" strokeLinecap="round" />
      <text x="358" y="120" textAnchor="middle" fill="#4caf50" fontSize="12" fontWeight="700" transform="rotate(90,358,120)">130 px ✓</text>
      <text x="200" y="120" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="14" fontWeight="600">↔️ Opposite sides</text>
      <text x="200" y="140" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="14" fontWeight="600">are always EQUAL!</text>
      <text x="200" y="230" textAnchor="middle" fill="var(--gold)" fontSize="14" fontWeight="700">That is the secret of rectangles!</text>
    </svg>,
    // Slide 5: Your turn!
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="400" height="240" fill="#1a1a5e" />
      {/* Three rectangles in celebration */}
      <rect x="40" y="60" width="80" height="50" rx="4" fill="rgba(255,193,7,0.25)" stroke="#ffc107" strokeWidth="2"><animate attributeName="y" values="60;55;60" dur="2s" repeatCount="indefinite" /></rect>
      <rect x="160" y="40" width="80" height="120" rx="4" fill="rgba(99,102,241,0.25)" stroke="#8b5cf6" strokeWidth="2"><animate attributeName="y" values="40;35;40" dur="2s" begin="0.3s" repeatCount="indefinite" /></rect>
      <rect x="280" y="70" width="80" height="40" rx="4" fill="rgba(76,175,80,0.25)" stroke="#4caf50" strokeWidth="2"><animate attributeName="y" values="70;65;70" dur="2s" begin="0.6s" repeatCount="indefinite" /></rect>
      {/* Summary text */}
      <text x="200" y="190" textAnchor="middle" fill="var(--gold)" fontSize="14" fontWeight="700">4 sides • 4 corners</text>
      <text x="200" y="210" textAnchor="middle" fill="var(--gold)" fontSize="14" fontWeight="700">Opposite sides are equal!</text>
      <text x="200" y="235" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="13">🚀 Let us practice!</text>
    </svg>,
  ];
  return (
    <div className="story-svg-visual">
      {illustrations[slideIndex] || illustrations[0]}
    </div>
  );
}

export default function StoryPhase({ onComplete, audioEnabled }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [textRevealed, setTextRevealed] = useState(false);
  const [highlightVisible, setHighlightVisible] = useState(false);
  const [flipping, setFlipping] = useState(false);

  const slide = STORY_SLIDES[currentSlide];
  const totalSlides = STORY_SLIDES.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  useEffect(() => {
    setTextRevealed(false);
    setHighlightVisible(false);

    const t1 = setTimeout(() => setTextRevealed(true), 300);
    const t2 = setTimeout(() => setHighlightVisible(true), 800);

    // Narrate the slide text
    const segments = [say(slide.text)];
    if (slide.highlight) segments.push(emphasize(slide.highlight));
    const handle = narrate(segments, audioEnabled);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (handle?.cancel) handle.cancel();
      stopNarration();
    };
  }, [currentSlide, audioEnabled]);

  const goToSlide = useCallback((idx) => {
    if (idx === currentSlide || flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setFlipping(false);
    }, 200);
  }, [currentSlide, flipping]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) goToSlide(currentSlide + 1);
    else onComplete();
  };
  const handlePrev = () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
  };

  return (
    <div className="story-phase">
      {/* Progress bar */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="story-progress-label">{currentSlide + 1}/{totalSlides}</span>
      </div>

      {/* Story card */}
      <div className={`story-card ${flipping ? 'flipping' : ''}`}>
        <div className="story-image-section">
          <StoryIllustration slideIndex={currentSlide} />
          <div className="story-image-overlay" />
        </div>

        <div className="story-text-section">
          <h3 className="story-title">{slide.title}</h3>
          <p className={`story-text ${textRevealed ? 'revealed' : ''}`}>{slide.text}</p>

          {slide.highlight && (
            <div className={`story-highlight ${highlightVisible ? 'visible' : ''}`}>
              <span style={{ fontSize: '1.2rem' }}>✨</span>
              <span className="story-highlight-text">{slide.highlight}</span>
            </div>
          )}

          {/* Mascot */}
          <div className="story-mascot">
            <div className="mascot" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '0.85rem' }}>{slide.mascot}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          style={{ opacity: currentSlide === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>

        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div
              key={i}
              className={`story-dot ${i === currentSlide ? 'active' : i < currentSlide ? 'completed' : ''}`}
              onClick={() => goToSlide(i)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleNext}>
          {currentSlide === totalSlides - 1 ? "Let's Practice! →" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
