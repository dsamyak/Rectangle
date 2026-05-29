import React, { useState, useEffect, useRef } from 'react';
import { isRectangle } from '../../utils/geometry';
import { narrate } from '../../utils/audio';
import { simulateNarration } from '../../utils/narration';

export default function ShapeBuilder({ onComplete }) {
  const [points, setPoints] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | correct | wrong
  const canvasRef = useRef(null);

  useEffect(() => {
    narrate(simulateNarration('builder'));
  }, []);

  const drawDots = (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let x = 40; x < w; x += 40) {
      for (let y = 40; y < h; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawLines = (ctx) => {
    if (points.length === 0) return;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    if (points.length === 4) {
      ctx.lineTo(points[0].x, points[0].y);
    }
    ctx.strokeStyle = status === 'correct' ? '#4caf50' : status === 'wrong' ? '#ef5350' : '#ffc107';
    ctx.lineWidth = 6;
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    drawDots(ctx, canvas.width, canvas.height);
    drawLines(ctx);
  }, [points, status]);

  const handleCanvasClick = (e) => {
    if (points.length >= 4) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Snap to nearest dot
    const snapX = Math.round(x / 40) * 40;
    const snapY = Math.round(y / 40) * 40;

    const newPoints = [...points, { x: snapX, y: snapY }];
    setPoints(newPoints);

    if (newPoints.length === 4) {
      const valid = isRectangle(newPoints);
      setStatus(valid ? 'correct' : 'wrong');
      setTimeout(() => {
        if (valid) onComplete();
        else {
          setPoints([]);
          setStatus('idle');
        }
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-2xl font-display text-white mb-4">Connect four dots to make a shape!</h3>
      <div className={`p-4 rounded-xl bg-white/5 border-2 ${status === 'correct' ? 'border-green' : status === 'wrong' ? 'border-red animate-shake' : 'border-white/20'}`}>
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onClick={handleCanvasClick}
          className="cursor-crosshair"
        />
      </div>
    </div>
  );
}
