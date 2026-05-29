# Technical Requirements Document (TRD)
## Rectangle: Introduction to Geometry (Shapes)
### Grade 1 Math | Intellia SG — Gamified Simulation Module

**Version:** 1.0  
**Stack:** React 18 + Vite + Tailwind CSS  
**Audio Provider:** ElevenLabs (`eleven_multilingual_v2`, Alice voice)  
**Reference Implementation:** `equal-tau.vercel.app` / `github.com/dsamyak/equal`

---

## 1. Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components, hooks) |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS (utility classes only, no JIT compiler required) |
| Animation | Framer Motion (React Motion library) |
| Audio | HTML5 Audio API + ElevenLabs REST API |
| State | React useState / useReducer (no Redux) |
| Drawing Canvas | HTML5 Canvas API (custom hook) |
| Voice Recording | Web Audio API / MediaRecorder API |
| Hosting | intelliasg.com (Vercel / Netlify compatible) |
| Environment | Vite `.env` with `VITE_ELEVENLABS_API_KEY` |

---

## 2. Project Structure

```
rectangle-geometry/
├── public/
│   └── assets/
│       └── audio/               # Pre-generated .mp3 narration files
│           ├── audio_wonder_do_you_see_0.mp3
│           ├── audio_story_sarah_mike_0.mp3
│           └── ...
├── scripts/
│   ├── generate_audio.js        # Offline ElevenLabs pre-generation script
│   └── clean_audio.js           # Orphan audio cleanup utility
├── src/
│   ├── App.jsx                  # Root — phase router
│   ├── main.jsx
│   ├── components/
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx
│   │   │   ├── StoryPhase.jsx
│   │   │   ├── SimulatePhase.jsx
│   │   │   ├── PlayPhase.jsx
│   │   │   └── ReflectPhase.jsx
│   │   ├── simulations/
│   │   │   ├── ShapeBuilder.jsx
│   │   │   ├── RealWorldSpotter.jsx
│   │   │   ├── PropertiesExplorer.jsx
│   │   │   └── ShapeSorter.jsx
│   │   ├── games/
│   │   │   ├── GameWorld.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── ScoreBoard.jsx
│   │   ├── ui/
│   │   │   ├── PhaseBar.jsx
│   │   │   ├── CharacterBubble.jsx
│   │   │   ├── NarrationCaption.jsx
│   │   │   ├── CelebrationOverlay.jsx
│   │   │   └── StarRating.jsx
│   │   └── characters/
│   │       ├── Robo.jsx
│   │       ├── Sarah.jsx
│   │       └── Mike.jsx
│   ├── utils/
│   │   ├── audio.js             # Core audio engine (getAudioUrl, speak, narrate, preload)
│   │   ├── narration.js         # Phase → narration segment mapping
│   │   ├── audioMap.js          # Auto-generated: text → .mp3 path
│   │   ├── questions.js         # Question bank + randomisation logic
│   │   └── geometry.js          # Shape validation utilities (isRectangle, etc.)
│   ├── hooks/
│   │   ├── usePhase.js          # Phase progression state machine
│   │   ├── useCanvas.js         # Drawing canvas interaction hook
│   │   └── useScore.js          # XP, combos, star rating logic
│   └── styles/
│       └── globals.css          # CSS variables, Tailwind base extensions
├── .env.local                   # VITE_ELEVENLABS_API_KEY
├── vite.config.js
└── package.json
```

---

## 3. Application Architecture

### 3.1 Phase State Machine (`usePhase.js`)

The app is a linear 5-phase state machine. Each phase is a full-screen view.

```javascript
// Phase IDs
const PHASES = ['wonder', 'story', 'simulate', 'play', 'reflect'];

// State
const [currentPhase, setCurrentPhase] = useState('wonder');
const [phaseProgress, setPhaseProgress] = useState({
  wonder: 'idle',     // idle | active | complete
  story: 'idle',
  simulate: 'idle',
  play: 'idle',
  reflect: 'idle',
});

// Advance: called by each phase's completion handler
function advancePhase() {
  const idx = PHASES.indexOf(currentPhase);
  if (idx < PHASES.length - 1) {
    setCurrentPhase(PHASES[idx + 1]);
  }
}
```

Phase transitions use Framer Motion `AnimatePresence` with a slide-up entry and fade exit.

---

### 3.2 Audio Engine (`src/utils/audio.js`)

Exact architecture from `audio_generation_pipeline.md`:

```javascript
import { audioMap } from './audioMap.js';

const ELEVENLABS_VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const ELEVENLABS_MODEL = 'eleven_multilingual_v2';
const elevenLabsCache = new Map();

// STYLE → ElevenLabs voice settings
const VOICE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  question:     { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement:{ stability: 0.50, similarity_boost: 0.90, style: 0.8 },
  emphasis:     { stability: 0.85, similarity_boost: 0.90, style: 0.1 },
  thinking:     { stability: 0.65, similarity_boost: 0.80, style: 0.4 },
  celebration:  { stability: 0.40, similarity_boost: 0.95, style: 0.9 },
  instruction:  { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
};

export async function getAudioUrl(text, style = 'statement') {
  // 1. Check pre-generated static asset
  if (audioMap[text]) return audioMap[text];

  // 2. Check in-memory cache
  const cacheKey = `${text}::${style}`;
  if (elevenLabsCache.has(cacheKey)) return elevenLabsCache.get(cacheKey);

  // 3. Dynamic generation
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': import.meta.env.VITE_ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: ELEVENLABS_MODEL,
          voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
        }),
      }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    elevenLabsCache.set(cacheKey, url);
    return url;
  } catch (err) {
    console.error('ElevenLabs audio error:', err);
    return null;
  }
}

export async function speak(text, style = 'statement') {
  const url = await getAudioUrl(text, style);
  if (!url) return;
  const audio = new Audio(url);
  return new Promise((resolve) => {
    audio.onended = resolve;
    audio.play().catch(resolve);
  });
}

export async function narrate(segments, onSegmentStart) {
  for (let i = 0; i < segments.length; i++) {
    const { text, style } = segments[i];
    // Preload next segment
    if (i + 1 < segments.length) {
      getAudioUrl(segments[i + 1].text, segments[i + 1].style);
    }
    if (onSegmentStart) onSegmentStart(i, text);
    await speak(text, style);
  }
}
```

---

### 3.3 Narration Mapping (`src/utils/narration.js`)

Each phase exports an array of `{ text, style }` segments. Text **must** match exactly what's shown on screen and what's in `audioMap.js`.

```javascript
// Helper wrappers
const say  = (text) => ({ text, style: 'statement' });
const ask  = (text) => ({ text, style: 'question' });
const cheer= (text) => ({ text, style: 'encouragement' });
const think= (text) => ({ text, style: 'thinking' });
const celebrate = (text) => ({ text, style: 'celebration' });

export function wonderNarration() {
  return [
    ask("Do you see something hiding all around you?"),
    ask("Look at your door. Look at your book. What shape do you notice?"),
    think("There is a secret shape everywhere. Can you find it?"),
  ];
}

export function storyNarration() {
  return [
    say("Sarah and Mike were decorating their classroom."),
    say("Mike picked up a picture frame."),
    ask("How many sides does this have?"),
    say("Robo counted. One, two, three, four! Four sides!"),
    ask("And how many corners? One, two, three, four! Four corners too!"),
    say("Robo pointed at the door. The door is the same shape! Four sides, four corners!"),
    celebrate("This shape is called a RECTANGLE!"),
    say("Rectangles have 4 sides and 4 corners. The sides across from each other are the same length."),
  ];
}

export function simulateNarration(simId) {
  const scripts = {
    builder: [
      say("Connect four dots to make a shape."),
      think("Try making your opposite sides equal!"),
    ],
    spotter: [
      ask("Can you find all the rectangles in this classroom?"),
      cheer("Yes! That is a rectangle! Count the sides with me!"),
    ],
    explorer: [
      say("Drag the handles to change the rectangle."),
      think("Look! The opposite sides always stay the same! That is the secret of rectangles!"),
    ],
    sorter: [
      say("Drag each shape to the correct bucket."),
      cheer("Great sorting! A rectangle has 4 sides and 4 corners!"),
    ],
  };
  return scripts[simId] || [];
}

export function playNarration() {
  return {
    correct: cheer("Amazing! That is a rectangle!"),
    wrong:   think("Hmm, let us look at that shape again!"),
    levelUp: celebrate("Level complete! You are doing so well!"),
  };
}

export function reflectNarration() {
  return [
    ask("Wow, you found so many rectangles today!"),
    ask("Can you tell me — what makes a rectangle special? Use your own words!"),
  ];
}

export function completionNarration() {
  return [celebrate("You are a Shape Hero today! Amazing work!")];
}
```

---

### 3.4 Question Bank & Randomisation (`src/utils/questions.js`)

```javascript
// Question types
const Q_TYPES = {
  IDENTIFY: 'identify',    // Tap all rectangles
  COUNT: 'count',          // How many sides?
  REAL_WORLD: 'realWorld', // Which object is a rectangle?
  TRUE_FALSE: 'trueFalse', // True or false?
  FILL_BLANK: 'fillBlank', // Fill in the blank
  ODD_ONE_OUT: 'oddOneOut', // Which is different?
};

// Full question bank (20+ questions)
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
    question: "Count the sides of this shape. [rectangle shown] Is this a rectangle?",
    options: ['Yes', 'No'],
    correct: 'Yes',
    showShape: 'rectangle',
  },
  {
    id: 'q15',
    type: Q_TYPES.COUNT,
    question: "Count the sides of this shape. [triangle shown] Is this a rectangle?",
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
    correct: false, // Rectangles can be portrait or landscape
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
    correct: false, // opposite sides equal, not all four
  },
];

// Randomise answer options for a question
export function shuffleOptions(question) {
  const q = { ...question };
  if (q.options) {
    q.options = [...q.options].sort(() => Math.random() - 0.5);
  }
  return q;
}

// Draw N unique questions randomly from pool
export function drawQuestions(pool = QUESTION_BANK, count = 5) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(shuffleOptions);
}

// Randomise shape orientation (0, 90, 180, 270 degrees)
export function randomOrientation() {
  return [0, 90, 180, 270][Math.floor(Math.random() * 4)];
}
```

---

### 3.5 Geometry Utilities (`src/utils/geometry.js`)

```javascript
// Check if 4 canvas points form a rectangle
// Points: [{x, y}, {x, y}, {x, y}, {x, y}] (in order)
export function isRectangle(points, tolerance = 10) {
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
    return Math.abs(v.dx * next.dx + v.dy * next.dy) < tolerance * 10;
  });

  return oppositesEqual && rightAngles;
}

// Rectangle shape definitions for rendering
export const SHAPES = {
  rectangle_wide:    { type: 'rect', w: 120, h: 60 },
  rectangle_tall:    { type: 'rect', w: 60, h: 110 },
  rectangle_small:   { type: 'rect', w: 70, h: 45 },
  rectangle_square_ish: { type: 'rect', w: 80, h: 80 },
  triangle:          { type: 'poly', points: [[50,0],[100,90],[0,90]] },
  circle:            { type: 'circle', r: 45 },
  star:              { type: 'star', points: 5, r: 45 },
};
```

---

### 3.6 Simulate Phase Components

#### ShapeBuilder.jsx
- Canvas with dot grid (7×7, spaced 40px).
- `onClick` on dots selects up to 4 dots.
- On 4th dot selected: draw lines, call `isRectangle(selectedPoints)`.
- Correct: green glow animation on sides + corners, Robo celebration.
- Incorrect: red shake, gentle feedback text + voice.

#### RealWorldSpotter.jsx
- SVG classroom scene with hotspot `<rect>` / `<g>` overlays on 6 objects.
- `onClick` on hotspot: highlight object outline, increment counter.
- Robo speech bubble appears at object location.
- All 6 found → celebration.

#### PropertiesExplorer.jsx
- SVG rectangle with 4 drag handles (corners).
- `onMouseMove` / `onTouchMove` updates width/height state.
- Width and height labels update live.
- CSS: opposite side labels share same numeric value → visual "equal" proof.
- "Check My Rectangle" button triggers side-by-side comparison animation.

#### ShapeSorter.jsx
- 8 shape cards (rendered via SVG), positioned randomly using CSS grid shuffle.
- Two drop zones: `onDragOver`, `onDrop` handlers.
- Correct drop: card flies into bucket with bounce animation.
- Wrong drop: card wobbles back to original position.

---

### 3.7 Play Phase — Game Engine (`GameWorld.jsx`)

```javascript
// Game state
const [level, setLevel] = useState(1);         // 1=Park, 2=School, 3=Supermarket
const [questions, setQuestions] = useState([]); // drawn per level
const [currentQ, setCurrentQ] = useState(0);
const [score, setScore] = useState({ xp: 0, combo: 0, stars: {} });

// On level start: draw 5 random questions
useEffect(() => {
  setQuestions(drawQuestions(QUESTION_BANK, 5));
  setCurrentQ(0);
}, [level]);

// Handle answer
function handleAnswer(answer) {
  const q = questions[currentQ];
  const isCorrect = answer === q.correct;

  if (isCorrect) {
    const xp = score.combo >= 2 ? 15 : 10; // combo bonus
    setScore(s => ({ ...s, xp: s.xp + xp, combo: s.combo + 1 }));
    speak(playNarration().correct.text, 'encouragement');
  } else {
    setScore(s => ({ ...s, combo: 0 }));
    speak(playNarration().wrong.text, 'thinking');
  }

  // Advance after delay
  setTimeout(() => {
    if (currentQ + 1 >= questions.length) finishLevel(isCorrect);
    else setCurrentQ(c => c + 1);
  }, 1200);
}

// Star calculation
function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.6) return 2;
  return 1;
}
```

---

### 3.8 Reflect Phase Components

#### VoiceRecorder
- Uses `MediaRecorder` API with `audio/webm` MIME type.
- Records 10–30 seconds max.
- Playback in browser, no server upload required in v1.
- Fallback: if microphone unavailable, auto-show DrawCanvas.

#### DrawCanvas
- Full HTML5 Canvas drawing surface.
- Toolbar: pencil, eraser, 4 colours.
- "Label" mode: tap to place text ("side", "corner").
- "Done" button triggers completion screen.

---

## 4. Audio Pre-generation Script (`scripts/generate_audio.js`)

```javascript
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const MODEL = 'eleven_multilingual_v2';
const OUTPUT_DIR = 'public/assets/audio';
const MAP_FILE = 'src/utils/audioMap.js';

const VOICE_SETTINGS = {
  statement:    { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
  question:     { stability: 0.55, similarity_boost: 0.80, style: 0.5 },
  encouragement:{ stability: 0.50, similarity_boost: 0.90, style: 0.8 },
  emphasis:     { stability: 0.85, similarity_boost: 0.90, style: 0.1 },
  thinking:     { stability: 0.65, similarity_boost: 0.80, style: 0.4 },
  celebration:  { stability: 0.40, similarity_boost: 0.95, style: 0.9 },
  instruction:  { stability: 0.75, similarity_boost: 0.85, style: 0.2 },
};

const phrases = [
  // WONDER
  { text: "Do you see something hiding all around you?", style: 'question' },
  { text: "Look at your door. Look at your book. What shape do you notice?", style: 'question' },
  { text: "There is a secret shape everywhere. Can you find it?", style: 'thinking' },
  // STORY
  { text: "Sarah and Mike were decorating their classroom.", style: 'statement' },
  { text: "Mike picked up a picture frame.", style: 'statement' },
  { text: "How many sides does this have?", style: 'question' },
  { text: "Robo counted. One, two, three, four! Four sides!", style: 'statement' },
  { text: "And how many corners? One, two, three, four! Four corners too!", style: 'question' },
  { text: "Robo pointed at the door. The door is the same shape! Four sides, four corners!", style: 'statement' },
  { text: "This shape is called a RECTANGLE!", style: 'celebration' },
  { text: "Rectangles have 4 sides and 4 corners. The sides across from each other are the same length.", style: 'emphasis' },
  // SIMULATE
  { text: "Connect four dots to make a shape.", style: 'instruction' },
  { text: "Try making your opposite sides equal!", style: 'thinking' },
  { text: "Can you find all the rectangles in this classroom?", style: 'question' },
  { text: "Yes! That is a rectangle! Count the sides with me!", style: 'encouragement' },
  { text: "Drag the handles to change the rectangle.", style: 'instruction' },
  { text: "Look! The opposite sides always stay the same! That is the secret of rectangles!", style: 'thinking' },
  { text: "Drag each shape to the correct bucket.", style: 'instruction' },
  { text: "Great sorting! A rectangle has 4 sides and 4 corners!", style: 'encouragement' },
  // PLAY
  { text: "Amazing! That is a rectangle!", style: 'encouragement' },
  { text: "Hmm, let us look at that shape again!", style: 'thinking' },
  { text: "Level complete! You are doing so well!", style: 'celebration' },
  // REFLECT
  { text: "Wow, you found so many rectangles today!", style: 'question' },
  { text: "Can you tell me — what makes a rectangle special? Use your own words!", style: 'question' },
  // COMPLETE
  { text: "You are a Shape Hero today! Amazing work!", style: 'celebration' },
];

// Main generation loop
async function generate() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const audioMap = {};

  for (const [i, { text, style }] of phrases.entries()) {
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 40);
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`[SKIP] ${filename}`);
      audioMap[text] = `/assets/audio/${filename}`;
      continue;
    }

    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.VITE_ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: MODEL,
          voice_settings: VOICE_SETTINGS[style],
        }),
      }
    );

    if (!res.ok) {
      console.error(`[ERROR] ${text}: ${res.status}`);
      continue;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filepath, buffer);
    audioMap[text] = `/assets/audio/${filename}`;
    console.log(`[OK] ${filename}`);
  }

  // Write audioMap.js
  const mapContent = `// AUTO-GENERATED — do not edit manually
// Run: node scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log(`\naudioMap.js written with ${Object.keys(audioMap).length} entries.`);
}

generate().catch(console.error);
```

---

## 5. Component Specifications

### PhaseBar.jsx
- 5 circular step indicators, connected by a line.
- Active step: filled circle with glow animation.
- Complete step: filled with checkmark.
- Inactive: outlined circle.
- Responsive: collapses to icon-only on mobile (<480px).

### NarrationCaption.jsx
- Fixed bottom bar (height: 64px).
- Shows current narration segment text, synced to audio playback.
- Fade-in per segment; auto-hides 1s after audio ends.
- Font: large, rounded, high-contrast.

### CharacterBubble.jsx
- Speech bubble with character avatar (Robo / Sarah / Mike).
- Entrance: slide-in from right (Robo), from left (Sarah), from bottom (Mike).
- Triggered programmatically by narration phase.

### CelebrationOverlay.jsx
- Full-screen confetti animation (CSS keyframe based — no library dependency).
- Star burst effect on level completion.
- Auto-dismisses after 2.5 seconds or on tap.

---

## 6. Routing & URL Structure

No React Router needed (single-lesson SPA). The module loads at:

```
https://intelliasg.com/courses/grade-1-math/rectangle/
```

Phase is managed entirely in React state (no URL fragments required for v1).

---

## 7. Performance Requirements

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s (with CDN) |
| Time to Interactive | < 3s |
| Audio start latency (pre-generated) | < 100ms |
| Audio start latency (dynamic) | < 800ms |
| Largest Contentful Paint | < 2.5s |
| Bundle size (gzipped) | < 250KB JS |

**Optimisations:**
- All `.mp3` assets served from CDN with cache headers.
- SVG shapes inlined (no image files).
- Character illustrations: SVG or WebP with lazy load.
- `React.memo` on shape components to prevent re-renders during animation.
- Canvas operations batched with `requestAnimationFrame`.

---

## 8. Accessibility (WCAG 2.1 AA)

- All interactive elements: `aria-label`, `role`, `tabIndex`.
- Audio narration: `<NarrationCaption>` synced subtitles (always visible, not toggle).
- Canvas drawing: keyboard fallback (arrow key dot selection for shape builder).
- Colour contrast: all text ≥ 4.5:1 against background.
- Touch targets: minimum 44×44px (WCAG 2.5.5).
- `prefers-reduced-motion`: disable non-essential animations.

---

## 9. Browser & Device Support

| Platform | Minimum Version |
|---|---|
| Chrome | 90+ |
| Safari (iOS) | 14+ |
| Firefox | 88+ |
| Samsung Internet | 14+ |
| Edge | 90+ |
| Android Chrome | 90+ |

Viewport: 320px – 1920px. Optimised for 768px (tablet) and 1024px (desktop).

---

## 10. Environment Variables

```bash
# .env.local
VITE_ELEVENLABS_API_KEY=your_key_here
```

No other secrets required for v1.

---

## 11. Deployment

- Build: `npm run build` → `dist/`
- Deploy `dist/` to Vercel / Netlify / any static host.
- Set environment variable `VITE_ELEVENLABS_API_KEY` in hosting dashboard.
- Run `node scripts/generate_audio.js` **before** building to populate `public/assets/audio/`.
- The `audioMap.js` is committed to source after generation.

---

## 12. Development Setup

```bash
# Clone repo
git clone https://github.com/[intellia]/rectangle-geometry.git

# Install dependencies
npm install

# Generate audio assets (requires API key in .env.local)
node scripts/generate_audio.js

# Dev server
npm run dev

# Build for production
npm run build
```

---

*Document Version 1.0 — Intellia SG | Rectangle Module TRD*
