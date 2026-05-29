import React, { useState, useCallback } from 'react';

// Inline shape rendering for shape-type questions
function ShapeVisual({ shapeType, size = 60 }) {
  const style = { display: 'flex', alignItems: 'center', justifyContent: 'center' };
  switch (shapeType) {
    case 'rectangle_wide':
      return <div style={style}><div style={{ width: size * 1.6, height: size * 0.8, background: 'rgba(255,193,7,0.3)', border: '3px solid #ffc107', borderRadius: 4 }} /></div>;
    case 'rectangle_tall':
      return <div style={style}><div style={{ width: size * 0.7, height: size * 1.4, background: 'rgba(255,193,7,0.3)', border: '3px solid #ffc107', borderRadius: 4 }} /></div>;
    case 'rectangle_small':
      return <div style={style}><div style={{ width: size * 1.2, height: size * 0.6, background: 'rgba(255,193,7,0.3)', border: '3px solid #ffc107', borderRadius: 4 }} /></div>;
    case 'rectangle':
      return <div style={style}><div style={{ width: size * 1.5, height: size * 0.8, background: 'rgba(255,193,7,0.3)', border: '3px solid #ffc107', borderRadius: 4 }} /></div>;
    case 'square':
      return <div style={style}><div style={{ width: size, height: size, background: 'rgba(99,102,241,0.3)', border: '3px solid #6366f1', borderRadius: 4 }} /></div>;
    case 'circle':
      return <div style={style}><div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(239,83,80,0.3)', border: '3px solid #ef5350' }} /></div>;
    case 'triangle':
      return <div style={style}><div style={{ width: 0, height: 0, borderLeft: `${size/2}px solid transparent`, borderRight: `${size/2}px solid transparent`, borderBottom: `${size * 0.85}px solid rgba(76,175,80,0.5)` }} /></div>;
    case 'star':
      return <div style={{ ...style, fontSize: size * 0.8, opacity: 0.8 }}>⭐</div>;
    case 'hexagon':
      return <div style={{ ...style, fontSize: size * 0.7, opacity: 0.8 }}>⬡</div>;
    case 'pentagon':
      return <div style={{ ...style, fontSize: size * 0.7, opacity: 0.8 }}>⬠</div>;
    default:
      return <div style={{ ...style, fontSize: size * 0.6 }}>❓</div>;
  }
}

export default function QuestionRenderer({ question, onAnswer, disabled }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = useCallback((option) => {
    if (disabled) return;
    setSelectedOption(option);
    const isCorrect = String(option) === String(question.correctAnswer);
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedOption(null);
    }, 600);
  }, [disabled, question.correctAnswer, onAnswer]);

  return (
    <div>
      <div style={{ display: 'inline-block', background: 'var(--coral)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, letterSpacing: '0.5px' }}>
        📐 RECTANGLES
      </div>
      <p className="question-text">{question.questionText}</p>

      {/* Shape visual */}
      {question.visual === 'shape' && (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <ShapeVisual shapeType={question.shapeType || 'rectangle'} size={80} />
        </div>
      )}

      {/* Emoji single */}
      {question.visual === 'emoji_single' && (
        <div style={{ fontSize: '4rem', textAlign: 'center', margin: '16px 0' }}>
          {question.objectEmoji}
        </div>
      )}

      {/* Shape grid for odd-one-out or identify */}
      {question.isShapeOptions ? (
        <div className="shape-cards-grid">
          {question.options.map((opt, i) => {
            let cls = 'shape-option-card';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct-reveal' : ' wrong-reveal';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct-reveal';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)} disabled={disabled}>
                <ShapeVisual shapeType={opt} size={50} />
              </button>
            );
          })}
        </div>
      ) : question.options && (
        <div className="options-grid">
          {question.options.map((opt, i) => {
            let cls = 'option-btn';
            if (disabled) cls += ' disabled';
            if (selectedOption === opt) {
              cls += String(opt) === String(question.correctAnswer) ? ' correct' : ' wrong';
            } else if (disabled && String(opt) === String(question.correctAnswer)) {
              cls += ' correct';
            }
            return (
              <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
