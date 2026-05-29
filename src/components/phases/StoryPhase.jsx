import React, { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration, preloadNarration, say, emphasize } from '../../utils/audio';
import { STORY_SLIDES } from '../../utils/narration';

function StoryIllustration({ slideIndex }) {
  const images = [
    '/assets/images/story/slide1.png',
    '/assets/images/story/slide2.png',
    '/assets/images/story/slide3.png',
    '/assets/images/story/slide4.png',
    '/assets/images/story/slide5.png',
    '/assets/images/story/slide6.png',
  ];
  return (
    <img src={images[slideIndex] || images[0]} alt={`Story slide ${slideIndex + 1}`} className="story-image" />
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
