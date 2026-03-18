import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicGifsDir = path.join(__dirname, '../public/gifs');
const outputFile = path.join(__dirname, '../public/gifs/manifest.json');

const categories = ['lose', 'hope', 'jackpot', 'good-luck'];

function generateManifest() {
  const manifest = {};

  categories.forEach(category => {
    const categoryPath = path.join(publicGifsDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath)
        .filter(file => /\.(gif|jpg|jpeg|png|webp)$/i.test(file));
      manifest[category] = files.map(file => `/gifs/${category}/${file}`);
    } else {
      manifest[category] = [];
    }
  });

  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
  console.log(`✅ Manifest generated at ${outputFile}`);
}

generateManifest();
