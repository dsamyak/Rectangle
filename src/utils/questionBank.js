// ──────────────────────────────────────────────────
// Question Bank — Rectangle Geometry (100 Questions, 10 Types)
// Grade 1 Aligned
// ──────────────────────────────────────────────────

const realWorldRects = ['door','window','book','notebook','picture frame','phone screen','whiteboard','TV screen','laptop','tablet'];
const realWorldNonRects = ['ball','wheel','pizza','coin','clock face','orange','star','diamond','heart','egg'];
const emojis = { door: '🚪', window: '🪟', book: '📖', notebook: '📓', 'picture frame': '🖼️', 'phone screen': '📱', whiteboard: '📋', 'TV screen': '📺', laptop: '💻', tablet: '📲', ball: '⚽', wheel: '🎡', pizza: '🍕', coin: '🪙', 'clock face': '🕐', orange: '🍊', star: '⭐', diamond: '💎', heart: '❤️', egg: '🥚' };

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateDistractors(correct, options) {
  if (options) return shuffleArray(options);
  const distractors = new Set();
  const offsets = [-2, -1, 1, 2, 3];
  shuffleArray(offsets).forEach(o => {
    const d = correct + o;
    if (d >= 0 && d !== correct && distractors.size < 3) distractors.add(d);
  });
  while (distractors.size < 3) distractors.add(correct + distractors.size + 1);
  return shuffleArray([correct, ...distractors]);
}

// Q1: Count sides
function genQ1(id, diff) {
  const shapes = diff === 1 ? ['rectangle'] : diff === 2 ? ['rectangle', 'square'] : ['rectangle', 'square', 'rhombus'];
  const shape = pick(shapes);
  const correct = shape === 'rectangle' || shape === 'square' || shape === 'rhombus' ? 4 : 3;
  return {
    id, type: 'count_sides', difficulty: diff, world: 0,
    questionText: `How many sides does a ${shape} have?`,
    visual: 'shape', shapeType: shape,
    hint1: `Count each edge of the ${shape} carefully.`,
    hint2: `Trace your finger along each side and count!`,
    explanation: `A ${shape} has ${correct} sides.`,
    options: generateDistractors(correct),
    correctAnswer: correct,
  };
}

// Q2: Count corners
function genQ2(id, diff) {
  return {
    id, type: 'count_corners', difficulty: diff, world: 0,
    questionText: 'How many corners does a rectangle have?',
    visual: 'shape', shapeType: 'rectangle',
    hint1: 'Corners are where two sides meet.',
    hint2: 'Point to each corner and count!',
    explanation: 'A rectangle has 4 corners (also called vertices).',
    options: generateDistractors(4),
    correctAnswer: 4,
  };
}

// Q3: True/False — properties
function genQ3(id, diff) {
  const statements = [
    { text: 'A rectangle has 4 sides.', correct: 'True' },
    { text: 'A rectangle has 3 corners.', correct: 'False' },
    { text: 'Opposite sides of a rectangle are the same length.', correct: 'True' },
    { text: 'A rectangle has 5 sides.', correct: 'False' },
    { text: 'A circle is a rectangle.', correct: 'False' },
    { text: 'A door is shaped like a rectangle.', correct: 'True' },
    { text: 'A rectangle must always be wider than tall.', correct: 'False' },
    { text: 'A triangle has the same number of sides as a rectangle.', correct: 'False' },
    { text: 'A notebook is shaped like a rectangle.', correct: 'True' },
    { text: 'All sides of a rectangle are the same length.', correct: 'False' },
  ];
  const s = pick(statements);
  return {
    id, type: 'true_false', difficulty: diff, world: 0,
    questionText: `"${s.text}" — True or False?`,
    visual: 'none',
    hint1: 'Think about what you learned about rectangles.',
    hint2: 'A rectangle has 4 sides, 4 corners, and opposite sides are equal.',
    explanation: `The answer is ${s.correct}. ${s.text}`,
    options: ['True', 'False'],
    correctAnswer: s.correct,
  };
}

// Q4: Identify rectangle from real world
function genQ4(id, diff) {
  const rectObj = pick(realWorldRects);
  const nonRects = shuffleArray(realWorldNonRects).slice(0, 3);
  const options = shuffleArray([rectObj, ...nonRects]);
  return {
    id, type: 'real_world_identify', difficulty: diff, world: 0,
    questionText: 'Which of these is shaped like a rectangle?',
    visual: 'emoji_options', objectEmojis: Object.fromEntries(options.map(o => [o, emojis[o] || '❓'])),
    hint1: 'A rectangle has 4 sides and 4 corners.',
    hint2: 'Think about which objects have four straight sides.',
    explanation: `A ${rectObj} is shaped like a rectangle!`,
    options: options.map(o => `${emojis[o] || ''} ${o}`),
    correctAnswer: `${emojis[rectObj] || ''} ${rectObj}`,
  };
}

// Q5: Fill blank — sides
function genQ5(id, diff) {
  return {
    id, type: 'fill_sides', difficulty: diff, world: 0,
    questionText: 'A rectangle has ___ sides.',
    visual: 'sentence',
    hint1: 'Count the sides of any rectangle you can see.',
    hint2: 'Top, bottom, left, right — how many is that?',
    explanation: 'A rectangle has 4 sides.',
    options: generateDistractors(4),
    correctAnswer: 4,
  };
}

// Q6: Fill blank — corners
function genQ6(id, diff) {
  return {
    id, type: 'fill_corners', difficulty: diff, world: 0,
    questionText: 'A rectangle has ___ corners.',
    visual: 'sentence',
    hint1: 'Corners are where two sides meet.',
    hint2: 'A rectangle has a corner at each turn!',
    explanation: 'A rectangle has 4 corners.',
    options: generateDistractors(4),
    correctAnswer: 4,
  };
}

// Q7: Odd one out — shapes
function genQ7(id, diff) {
  const shapeGroups = [
    { shapes: ['rectangle_wide', 'rectangle_tall', 'rectangle_small', 'triangle'], odd: 'triangle', reason: 'triangle is not a rectangle' },
    { shapes: ['rectangle_wide', 'circle', 'rectangle_tall', 'rectangle_small'], odd: 'circle', reason: 'circle is not a rectangle' },
    { shapes: ['rectangle_wide', 'rectangle_small', 'star', 'rectangle_tall'], odd: 'star', reason: 'star is not a rectangle' },
    { shapes: ['rectangle_wide', 'rectangle_tall', 'hexagon', 'rectangle_small'], odd: 'hexagon', reason: 'hexagon is not a rectangle' },
  ];
  const group = pick(shapeGroups);
  const shuffled = shuffleArray(group.shapes);
  return {
    id, type: 'odd_one_out', difficulty: diff, world: 0,
    questionText: 'Which shape is NOT a rectangle?',
    visual: 'shape_grid', shapes: shuffled,
    hint1: 'A rectangle has 4 sides and 4 corners.',
    hint2: 'Look for the shape that does not have 4 sides or 4 corners.',
    explanation: `The ${group.odd} is the odd one out because a ${group.reason}.`,
    options: shuffled,
    correctAnswer: group.odd,
    isShapeOptions: true,
  };
}

// Q8: Which is a rectangle (shape visual)?
function genQ8(id, diff) {
  const rectShape = pick(['rectangle_wide', 'rectangle_tall', 'rectangle_small']);
  const nonRects = shuffleArray(['circle', 'triangle', 'star', 'hexagon', 'pentagon']).slice(0, 3);
  const options = shuffleArray([rectShape, ...nonRects]);
  return {
    id, type: 'identify_shape', difficulty: diff, world: 0,
    questionText: 'Which of these shapes is a rectangle?',
    visual: 'shape_grid', shapes: options,
    hint1: 'A rectangle has 4 straight sides.',
    hint2: 'Look for the shape with 4 corners and opposite sides equal.',
    explanation: `The rectangle has 4 sides and 4 corners with opposite sides equal!`,
    options,
    correctAnswer: rectShape,
    isShapeOptions: true,
  };
}

// Q9: Comparison — rectangle vs square
function genQ9(id, diff) {
  const questions = [
    { text: 'What is the difference between a rectangle and a square?', correct: 'A square has all sides equal', wrong: ['They have different corners', 'A square has 5 sides', 'They are exactly the same'] },
    { text: 'A square is a special kind of rectangle. True or False?', correct: 'True', wrong: ['False'], options: ['True', 'False'] },
    { text: 'How are a rectangle and a square alike?', correct: 'Both have 4 sides and 4 corners', wrong: ['Both are round', 'Both have 3 sides', 'Both have 5 corners'] },
  ];
  const q = pick(questions);
  const opts = q.options || shuffleArray([q.correct, ...q.wrong]);
  return {
    id, type: 'compare_shapes', difficulty: diff, world: 0,
    questionText: q.text,
    visual: 'none',
    hint1: 'Think about the sides and corners.',
    hint2: 'A rectangle has 4 sides, 4 corners, opposite sides equal. A square has ALL sides equal.',
    explanation: `The answer is: ${q.correct}.`,
    options: opts,
    correctAnswer: q.correct,
  };
}

// Q10: Real-world spotting
function genQ10(id, diff) {
  const obj = pick(realWorldRects);
  return {
    id, type: 'real_world_spot', difficulty: diff, world: 0,
    questionText: `Is a ${obj} shaped like a rectangle?`,
    visual: 'emoji_single', objectEmoji: emojis[obj] || '❓',
    hint1: `Think about the shape of a ${obj}. Does it have 4 sides?`,
    hint2: 'A rectangle has 4 sides, 4 corners, and opposite sides are equal.',
    explanation: `Yes! A ${obj} is shaped like a rectangle — it has 4 sides, 4 corners, and opposite sides are equal.`,
    options: ['Yes', 'No'],
    correctAnswer: 'Yes',
  };
}

const generators = [genQ1, genQ2, genQ3, genQ4, genQ5, genQ6, genQ7, genQ8, genQ9, genQ10];

const diffDist = {
  q1:  [1,1,1,1,1,2,2,2,3,3],
  q2:  [1,1,1,1,1,2,2,2,3,3],
  q3:  [1,1,1,1,2,2,2,2,3,3],
  q4:  [1,1,1,2,2,2,2,3,3,3],
  q5:  [1,1,1,2,2,2,2,3,3,3],
  q6:  [1,1,1,2,2,2,2,3,3,3],
  q7:  [1,1,1,2,2,2,2,3,3,3],
  q8:  [1,1,1,1,2,2,2,2,3,3],
  q9:  [1,1,1,1,2,2,2,2,3,3],
  q10: [1,1,1,2,2,2,2,3,3,3],
};

export function generateSessionQuestions() {
  const bank = [];
  let qid = 1;
  const qKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];

  generators.forEach((gen, gi) => {
    const diffs = diffDist[qKeys[gi]];
    diffs.forEach(diff => {
      bank.push(gen(`Q${gi + 1}_${String(qid).padStart(3, '0')}`, diff));
      qid++;
    });
  });

  const selected = shuffleArray(bank);
  selected.forEach((q, index) => {
    q.world = Math.floor(index / 10);
  });

  return selected;
}
