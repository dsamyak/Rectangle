export const Q_TYPES = {
  IDENTIFY: 'identify',
  COUNT: 'count',
  REAL_WORLD: 'realWorld',
  TRUE_FALSE: 'trueFalse',
  FILL_BLANK: 'fillBlank',
  ODD_ONE_OUT: 'oddOneOut',
};

export const QUESTION_BANK = [
  {
    id: 'q1',
    type: Q_TYPES.COUNT,
    question: "How many sides does a rectangle have?",
    options: [3, 4, 5, 6],
    correct: 4,
  },
  {
    id: 'q2',
    type: Q_TYPES.COUNT,
    question: "How many corners does a rectangle have?",
    options: [2, 3, 4, 5],
    correct: 4,
  },
  {
    id: 'q3',
    type: Q_TYPES.TRUE_FALSE,
    question: "A rectangle has 4 corners.",
    correct: true,
  },
  {
    id: 'q4',
    type: Q_TYPES.TRUE_FALSE,
    question: "A rectangle has 3 sides.",
    correct: false,
  },
  {
    id: 'q5',
    type: Q_TYPES.TRUE_FALSE,
    question: "Opposite sides of a rectangle are the same length.",
    correct: true,
  },
  {
    id: 'q6',
    type: Q_TYPES.REAL_WORLD,
    question: "Which of these is shaped like a rectangle?",
    options: ['door', 'ball', 'triangle_sign', 'pizza'],
    correct: 'door',
    images: true,
  },
  {
    id: 'q7',
    type: Q_TYPES.REAL_WORLD,
    question: "Which of these is shaped like a rectangle?",
    options: ['book', 'apple', 'star', 'circle_clock'],
    correct: 'book',
    images: true,
  },
  {
    id: 'q8',
    type: Q_TYPES.REAL_WORLD,
    question: "Which of these is shaped like a rectangle?",
    options: ['window', 'lollipop', 'yield_sign', 'banana'],
    correct: 'window',
    images: true,
  },
  {
    id: 'q9',
    type: Q_TYPES.FILL_BLANK,
    question: "A rectangle has ___ sides.",
    blank: 'sides',
    options: [2, 3, 4, 5],
    correct: 4,
  },
  {
    id: 'q10',
    type: Q_TYPES.FILL_BLANK,
    question: "A rectangle has ___ corners.",
    blank: 'corners',
    options: [2, 3, 4, 6],
    correct: 4,
  },
  {
    id: 'q11',
    type: Q_TYPES.TRUE_FALSE,
    question: "A circle is a rectangle.",
    correct: false,
  },
  {
    id: 'q12',
    type: Q_TYPES.TRUE_FALSE,
    question: "A door is shaped like a rectangle.",
    correct: true,
  },
  {
    id: 'q13',
    type: Q_TYPES.TRUE_FALSE,
    question: "A triangle has 4 sides like a rectangle.",
    correct: false,
  },
  {
    id: 'q14',
    type: Q_TYPES.COUNT,
    question: "Count the sides of this shape. Is this a rectangle?",
    options: ['Yes', 'No'],
    correct: 'Yes',
    showShape: 'rectangle',
  },
  {
    id: 'q15',
    type: Q_TYPES.COUNT,
    question: "Count the sides of this shape. Is this a rectangle?",
    options: ['Yes', 'No'],
    correct: 'No',
    showShape: 'triangle',
  },
  {
    id: 'q16',
    type: Q_TYPES.ODD_ONE_OUT,
    question: "Which shape is different?",
    shapes: ['rectangle_wide', 'rectangle_tall', 'rectangle_small', 'triangle'],
    correct: 'triangle',
  },
  {
    id: 'q17',
    type: Q_TYPES.ODD_ONE_OUT,
    question: "Which shape is different?",
    shapes: ['rectangle_landscape', 'circle', 'rectangle_portrait', 'rectangle_square_ish'],
    correct: 'circle',
  },
  {
    id: 'q18',
    type: Q_TYPES.TRUE_FALSE,
    question: "A rectangle must always be wider than it is tall.",
    correct: false,
  },
  {
    id: 'q19',
    type: Q_TYPES.TRUE_FALSE,
    question: "A notebook is shaped like a rectangle.",
    correct: true,
  },
  {
    id: 'q20',
    type: Q_TYPES.TRUE_FALSE,
    question: "A rectangle has all sides the same length.",
    correct: false,
  },
];

export function shuffleOptions(question) {
  const q = { ...question };
  if (q.options) {
    q.options = [...q.options].sort(() => Math.random() - 0.5);
  }
  if (q.shapes) {
    q.shapes = [...q.shapes].sort(() => Math.random() - 0.5);
  }
  return q;
}

export function drawQuestions(pool = QUESTION_BANK, count = 5) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(shuffleOptions);
}

export function randomOrientation() {
  return [0, 90, 180, 270][Math.floor(Math.random() * 4)];
}
