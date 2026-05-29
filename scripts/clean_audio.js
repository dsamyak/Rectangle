import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'public/assets/audio';
const MAP_FILE = 'src/utils/audioMap.js';

async function clean() {
  if (!fs.existsSync(OUTPUT_DIR)) return;
  if (!fs.existsSync(MAP_FILE)) {
    console.error('audioMap.js not found!');
    return;
  }

  // Import audioMap using dynamic import or reading the file
  const mapContent = fs.readFileSync(MAP_FILE, 'utf-8');
  // Simple regex extraction since it's just a generated js object
  const regex = /"(\/assets\/audio\/[^"]+)"/g;
  let match;
  const activeFiles = new Set();
  while ((match = regex.exec(mapContent)) !== null) {
    activeFiles.add(path.basename(match[1]));
  }

  const existingFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.mp3'));
  let deleted = 0;

  for (const file of existingFiles) {
    if (!activeFiles.has(file)) {
      fs.unlinkSync(path.join(OUTPUT_DIR, file));
      console.log(`[DELETED] ${file}`);
      deleted++;
    }
  }

  console.log(`\nCleanup complete: ${deleted} orphaned files removed.`);
}

clean().catch(console.error);
