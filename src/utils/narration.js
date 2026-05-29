// ──────────────────────────────────────────────────
// Narration Scripts — Rectangle Geometry
// Structured segments for each phase
// ──────────────────────────────────────────────────
import { say, ask, cheer, emphasize, think, celebrate, instruct, pause } from './audio';

// ===== WONDER PHASE =====
export function wonderNarration() {
  return [
    ask("Do you see something hiding all around you?"),
    ask("Look at your door. Look at your book. Look at your window. What shape do you notice?"),
    think("There is a secret shape everywhere. Can you find it?"),
    say("Let us discover what this mystery shape is!"),
  ];
}

export const WONDER_QUESTIONS = [
  { emoji: '🚪', question: "Look at a door. How many sides does it have?", sub: "Count the edges carefully!" },
  { emoji: '📖', question: "Think of a book. What shape is it?", sub: "It has four sides and four corners." },
  { emoji: '🖼️', question: "A picture frame has a special shape. What is it?", sub: "The sides across from each other are the same!" },
  { emoji: '📱', question: "Look at a phone screen. How many corners can you count?", sub: "One, two, three, four!" },
  { emoji: '🪟', question: "Windows on a building — what shape are they?", sub: "Four sides, four corners, opposite sides equal!" },
];

// ===== STORY PHASE =====
export const STORY_SLIDES = [
  {
    title: "The Classroom",
    text: "Sarah and Mike were decorating their classroom for Art Day. There were picture frames, posters, and colourful charts everywhere!",
    mascot: "Let us help Sarah and Mike discover shapes!",
    highlight: null,
  },
  {
    title: "The Picture Frame",
    text: "Mike picked up a picture frame. \"How many sides does this have?\" asked their helper Robo. Mike traced his finger along the edges: one, two, three, four!",
    mascot: "Count with me — one, two, three, four sides!",
    highlight: "4 sides!",
  },
  {
    title: "Counting Corners",
    text: "\"And how many corners?\" asked Robo. Sarah pointed at each corner of the frame. One, two, three, four! Four corners too!",
    mascot: "Corners are where two sides meet!",
    highlight: "4 corners!",
  },
  {
    title: "Rectangles Everywhere",
    text: "Robo pointed at the door. \"The door is the same shape! Four sides, four corners!\" Sarah looked around — the whiteboard, the window, even her notebook were the same shape!",
    mascot: "Can you see rectangles in your room too?",
    highlight: null,
  },
  {
    title: "The Secret of Rectangles",
    text: "\"Here is the secret,\" said Robo. \"The sides across from each other are always the same length. The top matches the bottom, and the left matches the right!\"",
    mascot: "Opposite sides are always equal — that is the magic!",
    highlight: "Opposite sides are equal!",
  },
  {
    title: "Your Turn!",
    text: "\"Now you know what a rectangle is!\" cheered Robo. \"Four sides, four corners, and opposite sides are always equal. Let us practice finding and making rectangles!\"",
    mascot: "Ready to become a Rectangle Expert? Let us go!",
    highlight: "4 sides • 4 corners • Opposite sides equal",
  },
];

// ===== SIMULATE PHASE =====
export function simulateNarration(stationId) {
  const scripts = {
    builder: [
      instruct("Tap four dots on the grid to make a rectangle!"),
      think("Remember — a rectangle has 4 sides and 4 corners."),
      cheer("Try to make the opposite sides equal!"),
    ],
    spotter: [
      ask("Can you spot all the rectangles among these shapes?"),
      instruct("Tap on each shape that is a rectangle!"),
      cheer("Great job finding the rectangles!"),
    ],
    properties: [
      ask("Let us test what you know about rectangles!"),
      instruct("Fill in the missing number."),
      cheer("You really know your rectangles!"),
    ],
  };
  return scripts[stationId] || [];
}

// ===== PLAY PHASE =====
export function playNarration() {
  return {
    correct: cheer("Amazing! That is correct!"),
    wrong: think("Hmm, let us look at that again!"),
    levelUp: celebrate("Level complete! You are doing so well!"),
    streak: celebrate("What a streak! You are on fire!"),
  };
}

// ===== REFLECT PHASE =====
export function reflectNarration() {
  return [
    ask("You found so many rectangles today!"),
    ask("Can you teach Robo about rectangles? Answer these questions!"),
  ];
}

export function completionNarration() {
  return [celebrate("You are a Shape Hero today! Amazing work!")];
}

export const REFLECT_QUESTIONS = [
  {
    question: "How many sides does a rectangle have?",
    emoji: "📐",
    options: [
      { label: "3 sides", emoji: "❌", correct: false },
      { label: "4 sides", emoji: "✅", correct: true },
      { label: "5 sides", emoji: "❌", correct: false },
    ],
  },
  {
    question: "How many corners does a rectangle have?",
    emoji: "📏",
    options: [
      { label: "2 corners", emoji: "❌", correct: false },
      { label: "3 corners", emoji: "❌", correct: false },
      { label: "4 corners", emoji: "✅", correct: true },
    ],
  },
  {
    question: "What is special about a rectangle's sides?",
    emoji: "🔍",
    options: [
      { label: "All sides are the same", emoji: "❌", correct: false },
      { label: "Opposite sides are equal", emoji: "✅", correct: true },
      { label: "No sides are equal", emoji: "❌", correct: false },
    ],
  },
];
