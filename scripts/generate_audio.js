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
  { text: "Look at your door. Look at your book. Look at your window. What shape do you notice?", style: 'question' },
  { text: "There is a secret shape everywhere. Can you find it?", style: 'thinking' },
  { text: "Let us discover what this mystery shape is!", style: 'statement' },
  
  // WONDER QUESTIONS (optional but good to have if user clicks)
  { text: "Look at a door. How many sides does it have?", style: 'question' },
  { text: "Think of a book. What shape is it?", style: 'question' },
  { text: "A picture frame has a special shape. What is it?", style: 'question' },
  { text: "Look at a phone screen. How many corners can you count?", style: 'question' },
  { text: "Windows on a building — what shape are they?", style: 'question' },

  // STORY
  { text: "Sarah and Mike were decorating their classroom for Art Day. There were picture frames, posters, and colourful charts everywhere!", style: 'statement' },
  { text: "Mike picked up a picture frame. \"How many sides does this have?\" asked their helper Robo. Mike traced his finger along the edges: one, two, three, four!", style: 'statement' },
  { text: "\"And how many corners?\" asked Robo. Sarah pointed at each corner of the frame. One, two, three, four! Four corners too!", style: 'question' },
  { text: "Robo pointed at the door. \"The door is the same shape! Four sides, four corners!\" Sarah looked around — the whiteboard, the window, even her notebook were the same shape!", style: 'statement' },
  { text: "\"Here is the secret,\" said Robo. \"The sides across from each other are always the same length. The top matches the bottom, and the left matches the right!\"", style: 'statement' },
  { text: "\"Now you know what a rectangle is!\" cheered Robo. \"Four sides, four corners, and opposite sides are always equal. Let us practice finding and making rectangles!\"", style: 'celebration' },

  // STORY HIGHLIGHTS
  { text: "4 sides!", style: 'emphasis' },
  { text: "4 corners!", style: 'emphasis' },
  { text: "Opposite sides are equal!", style: 'emphasis' },
  { text: "4 sides • 4 corners • Opposite sides equal", style: 'emphasis' },

  // SIMULATE
  { text: "Tap four dots on the grid to make a rectangle!", style: 'instruction' },
  { text: "Remember — a rectangle has 4 sides and 4 corners.", style: 'thinking' },
  { text: "Try to make the opposite sides equal!", style: 'cheer' },
  
  { text: "Can you spot all the rectangles among these shapes?", style: 'question' },
  { text: "Tap on each shape that is a rectangle!", style: 'instruction' },
  { text: "Great job finding the rectangles!", style: 'cheer' },
  
  { text: "Let us test what you know about rectangles!", style: 'question' },
  { text: "Fill in the missing number.", style: 'instruction' },
  { text: "You really know your rectangles!", style: 'cheer' },

  // PLAY
  { text: "Amazing! That is correct!", style: 'cheer' },
  { text: "Hmm, let us look at that again!", style: 'thinking' },
  { text: "Level complete! You are doing so well!", style: 'celebration' },
  { text: "What a streak! You are on fire!", style: 'celebration' },

  // REFLECT
  { text: "You found so many rectangles today!", style: 'question' },
  { text: "Can you teach Robo about rectangles? Answer these questions!", style: 'question' },
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
