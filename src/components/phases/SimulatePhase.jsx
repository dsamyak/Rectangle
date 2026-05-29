import React, { useState, useEffect, useCallback } from 'react';
import { narrate, stopNarration, sounds } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';
import { isRectangle } from '../../utils/geometry';

// ─── Station 1: Shape Builder ───
function ShapeBuilderStation({ onComplete, audioEnabled }) {
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(0);
  const GRID_SIZE = 7;
  const DOT_SIZE = 40;

  useEffect(() => {
    const handle = narrate(simulateNarration('builder'), audioEnabled);
    return () => { if (handle?.cancel) handle.cancel(); stopNarration(); };
  }, [audioEnabled]);

  const handleDotClick = (row, col) => {
    if (status !== 'idle' || points.length >= 4) return;
    const x = col * DOT_SIZE + DOT_SIZE / 2;
    const y = row * DOT_SIZE + DOT_SIZE / 2;
    if (points.some(p => p.row === row && p.col === col)) return;

    const newPoints = [...points, { x, y, row, col }];
    setPoints(newPoints);

    if (newPoints.length === 4) {
      const valid = isRectangle(newPoints);
      setStatus(valid ? 'correct' : 'wrong');
      if (valid) sounds.correct(); else sounds.wrong();
      setTimeout(() => {
        if (valid) {
          if (round >= 2) onComplete();
          else { setRound(r => r + 1); setPoints([]); setStatus('idle'); }
        } else { setPoints([]); setStatus('idle'); }
      }, 1200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className="simulate-header">
        <div className="simulate-label">🔨 Station 1: Build a Rectangle</div>
        <div className="simulate-sublabel">Tap 4 dots to make a rectangle! (Round {round + 1}/3)</div>
      </div>
      <div className="progress-dots">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i < round ? 'completed' : i === round ? 'active' : ''}`} />)}
      </div>
      <div style={{
        position: 'relative', width: GRID_SIZE * DOT_SIZE, height: GRID_SIZE * DOT_SIZE,
        background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: `2px solid ${status === 'correct' ? 'var(--green)' : status === 'wrong' ? 'var(--red)' : 'rgba(255,255,255,0.1)'}`,
      }}>
        {/* Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {points.length > 1 && points.map((p, i) => {
            const next = points[(i + 1) % points.length];
            if (i >= points.length - 1 && points.length < 4) return null;
            return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y}
              stroke={status === 'correct' ? '#4caf50' : status === 'wrong' ? '#ef5350' : '#ffc107'}
              strokeWidth="3" strokeLinecap="round" />;
          })}
        </svg>
        {/* Dots */}
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
          const row = Math.floor(i / GRID_SIZE);
          const col = i % GRID_SIZE;
          const isSelected = points.some(p => p.row === row && p.col === col);
          return (
            <div key={i} onClick={() => handleDotClick(row, col)} style={{
              position: 'absolute',
              left: col * DOT_SIZE + DOT_SIZE / 2 - 6,
              top: row * DOT_SIZE + DOT_SIZE / 2 - 6,
              width: 12, height: 12, borderRadius: '50%', cursor: 'pointer',
              background: isSelected ? '#ffc107' : 'rgba(255,255,255,0.25)',
              boxShadow: isSelected ? '0 0 8px #ffc107' : 'none',
              transition: 'all 0.2s ease',
            }} />
          );
        })}
      </div>
      {status === 'wrong' && <p style={{ color: 'var(--red)', fontWeight: 600 }}>Not a rectangle — try again!</p>}
      {status === 'correct' && <p style={{ color: 'var(--green)', fontWeight: 600 }}>✅ That is a rectangle!</p>}
    </div>
  );
}

// ─── Station 2: Rectangle Spotter ───
function SpotRectangleStation({ onComplete, audioEnabled }) {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(null);

  const rounds = [
    { shapes: [
      { id: 'rect1', type: 'rect', w: 80, h: 50, color: '#ffc107', isRect: true },
      { id: 'tri1', type: 'tri', color: '#4caf50', isRect: false },
      { id: 'circ1', type: 'circle', color: '#ef5350', isRect: false },
      { id: 'rect2', type: 'rect', w: 50, h: 70, color: '#8b5cf6', isRect: true },
    ]},
    { shapes: [
      { id: 'star1', type: 'star', color: '#ff9800', isRect: false },
      { id: 'rect3', type: 'rect', w: 90, h: 40, color: '#2196f3', isRect: true },
      { id: 'hex1', type: 'hex', color: '#e91e63', isRect: false },
      { id: 'sq1', type: 'rect', w: 60, h: 60, color: '#00bcd4', isRect: true },
    ]},
    { shapes: [
      { id: 'rect4', type: 'rect', w: 70, h: 45, color: '#ffc107', isRect: true },
      { id: 'circ2', type: 'circle', color: '#9c27b0', isRect: false },
      { id: 'tri2', type: 'tri', color: '#ff5722', isRect: false },
      { id: 'rect5', type: 'rect', w: 55, h: 80, color: '#4caf50', isRect: true },
    ]},
  ];

  useEffect(() => {
    const handle = narrate(simulateNarration('spotter'), audioEnabled);
    return () => { if (handle?.cancel) handle.cancel(); stopNarration(); };
  }, [audioEnabled]);

  const [selected, setSelected] = useState(new Set());
  const currentShapes = rounds[round].shapes;
  const correctIds = currentShapes.filter(s => s.isRect).map(s => s.id);

  const handleShapeClick = (shape) => {
    if (answered !== null) return;
    const newSelected = new Set(selected);
    if (newSelected.has(shape.id)) newSelected.delete(shape.id);
    else newSelected.add(shape.id);
    setSelected(newSelected);
  };

  const handleCheck = () => {
    const selectedArr = [...selected].sort();
    const correctArr = [...correctIds].sort();
    const isCorrect = selectedArr.length === correctArr.length && selectedArr.every((v, i) => v === correctArr[i]);
    setAnswered(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) sounds.correct(); else sounds.wrong();
    setTimeout(() => {
      if (isCorrect) {
        if (round >= 2) onComplete();
        else { setRound(r => r + 1); setSelected(new Set()); setAnswered(null); }
      } else { setSelected(new Set()); setAnswered(null); }
    }, 1200);
  };

  const renderShape = (shape) => {
    if (shape.type === 'circle') return <div style={{ width: 60, height: 60, borderRadius: '50%', background: shape.color + '40', border: `3px solid ${shape.color}` }} />;
    if (shape.type === 'tri') return <div style={{ width: 0, height: 0, borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: `52px solid ${shape.color}80` }} />;
    if (shape.type === 'star') return <span style={{ fontSize: '3rem' }}>⭐</span>;
    if (shape.type === 'hex') return <span style={{ fontSize: '3rem' }}>⬡</span>;
    return <div style={{ width: shape.w, height: shape.h, background: shape.color + '40', border: `3px solid ${shape.color}`, borderRadius: 4 }} />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className="simulate-header">
        <div className="simulate-label">🔍 Station 2: Spot the Rectangles</div>
        <div className="simulate-sublabel">Tap ALL the rectangles! (Round {round + 1}/3)</div>
      </div>
      <div className="progress-dots">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i < round ? 'completed' : i === round ? 'active' : ''}`} />)}
      </div>
      <div className="shape-cards-grid">
        {currentShapes.map(shape => (
          <div key={shape.id}
            className={`shape-option-card ${answered === 'correct' && shape.isRect ? 'correct-reveal' : ''} ${answered === 'wrong' && selected.has(shape.id) && !shape.isRect ? 'wrong-reveal' : ''}`}
            onClick={() => handleShapeClick(shape)}
            style={{ border: selected.has(shape.id) ? '2px solid var(--gold)' : undefined, background: selected.has(shape.id) ? 'rgba(255,193,7,0.1)' : undefined }}
          >
            {renderShape(shape)}
          </div>
        ))}
      </div>
      <button className="btn btn-primary btn-sm" onClick={handleCheck} disabled={selected.size === 0 || answered !== null}>
        Check My Answer
      </button>
      {answered === 'wrong' && <p style={{ color: 'var(--red)', fontWeight: 600 }}>Try again — find all the rectangles!</p>}
    </div>
  );
}

// ─── Station 3: Properties Quiz ───
function PropertiesStation({ onComplete, audioEnabled }) {
  const [round, setRound] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');

  const questions = [
    { text: 'A rectangle has ___ sides.', correct: '4' },
    { text: 'A rectangle has ___ corners.', correct: '4' },
    { text: 'Opposite sides of a rectangle are ___', correct: 'equal', options: ['equal', 'different', 'curved'] },
  ];

  useEffect(() => {
    const handle = narrate(simulateNarration('properties'), audioEnabled);
    return () => { if (handle?.cancel) handle.cancel(); stopNarration(); };
  }, [audioEnabled]);

  const q = questions[round];

  const handleAnswer = (val) => {
    if (status !== 'idle') return;
    setAnswer(val);
    const isCorrect = String(val) === String(q.correct);
    setStatus(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) sounds.correct(); else sounds.wrong();
    setTimeout(() => {
      if (isCorrect) {
        if (round >= 2) onComplete();
        else { setRound(r => r + 1); setAnswer(''); setStatus('idle'); }
      } else { setAnswer(''); setStatus('idle'); }
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div className="simulate-header">
        <div className="simulate-label">📝 Station 3: Rectangle Properties</div>
        <div className="simulate-sublabel">Fill in the missing part! (Round {round + 1}/3)</div>
      </div>
      <div className="progress-dots">
        {[0,1,2].map(i => <div key={i} className={`progress-dot ${i < round ? 'completed' : i === round ? 'active' : ''}`} />)}
      </div>

      <div className="question-card" style={{ maxWidth: 500 }}>
        <p className="question-text">{q.text}</p>

        {q.options ? (
          <div className="options-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            {q.options.map(opt => (
              <button key={opt}
                className={`option-btn ${answer === opt ? (status === 'correct' ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="sentence-row">
              <div className={`blank-input ${answer ? 'filled' : ''} ${status === 'correct' ? 'correct' : ''}`}>
                {answer || '?'}
              </div>
            </div>
            <div className="number-pad">
              {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} className="num-pad-btn" onClick={() => handleAnswer(String(n))}>{n}</button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main SimulatePhase ───
export default function SimulatePhase({ onComplete, audioEnabled }) {
  const [station, setStation] = useState(0);

  const stations = [
    { label: 'Build', icon: '🔨' },
    { label: 'Spot', icon: '🔍' },
    { label: 'Quiz', icon: '📝' },
  ];

  const handleStationComplete = () => {
    if (station < 2) setStation(s => s + 1);
    else onComplete();
  };

  return (
    <div className="simulate-phase">
      {/* Station progress */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {stations.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`journey-step-dot ${i < station ? 'completed' : ''}`}
              style={i === station ? { background: 'var(--gold)', borderColor: 'var(--gold)', color: '#1a1a2e', boxShadow: '0 0 12px rgba(255,193,7,0.4)' } :
                i < station ? { background: 'var(--green)', borderColor: 'var(--green)', color: 'white' } : {}}>
              {i < station ? '✓' : s.icon}
            </div>
            <span className="simulate-dot-label" style={{ color: i === station ? 'var(--gold)' : i < station ? 'var(--green-light)' : 'var(--text-muted)', fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {station === 0 && <ShapeBuilderStation onComplete={handleStationComplete} audioEnabled={audioEnabled} />}
      {station === 1 && <SpotRectangleStation onComplete={handleStationComplete} audioEnabled={audioEnabled} />}
      {station === 2 && <PropertiesStation onComplete={handleStationComplete} audioEnabled={audioEnabled} />}
    </div>
  );
}
