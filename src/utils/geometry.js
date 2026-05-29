// Check if 4 canvas points form a rectangle
// Points: [{x, y}, {x, y}, {x, y}, {x, y}] (in order)
export function isRectangle(points, tolerance = 15) {
  if (points.length !== 4) return false;

  // Side lengths
  const sides = points.map((p, i) => {
    const next = points[(i + 1) % 4];
    return Math.sqrt((next.x - p.x) ** 2 + (next.y - p.y) ** 2);
  });

  // Opposite sides equal (within tolerance)
  const oppositesEqual =
    Math.abs(sides[0] - sides[2]) < tolerance &&
    Math.abs(sides[1] - sides[3]) < tolerance;

  // Right angles: dot product of adjacent sides ≈ 0
  const vectors = points.map((p, i) => {
    const next = points[(i + 1) % 4];
    return { dx: next.x - p.x, dy: next.y - p.y };
  });

  const rightAngles = vectors.every((v, i) => {
    const next = vectors[(i + 1) % 4];
    // Normalize vectors to compare angles more reliably regardless of length
    const len1 = Math.sqrt(v.dx * v.dx + v.dy * v.dy);
    const len2 = Math.sqrt(next.dx * next.dx + next.dy * next.dy);
    if (len1 === 0 || len2 === 0) return false;
    const dotProduct = (v.dx * next.dx + v.dy * next.dy) / (len1 * len2);
    // dotProduct should be close to 0 for a right angle (cos 90 = 0)
    return Math.abs(dotProduct) < 0.2; // roughly ~11 degrees tolerance
  });

  return oppositesEqual && rightAngles;
}

// Rectangle shape definitions for rendering
export const SHAPES = {
  rectangle_wide:    { type: 'rect', w: 120, h: 60, isRectangle: true },
  rectangle_tall:    { type: 'rect', w: 60, h: 110, isRectangle: true },
  rectangle_small:   { type: 'rect', w: 70, h: 45, isRectangle: true },
  rectangle_square_ish: { type: 'rect', w: 80, h: 80, isRectangle: true },
  triangle:          { type: 'poly', points: [[50,0],[100,90],[0,90]], isRectangle: false },
  circle:            { type: 'circle', r: 45, isRectangle: false },
  star:              { type: 'star', points: 5, r: 45, isRectangle: false },
};
