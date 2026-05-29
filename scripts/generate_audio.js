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
