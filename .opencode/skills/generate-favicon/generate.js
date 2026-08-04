const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

async function generate() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node generate.js <path-to-svg> <output-directory>');
    process.exit(1);
  }

  const svgPath = path.resolve(args[0]);
  const outDir = path.resolve(args[1]);

  if (!fs.existsSync(svgPath)) {
    console.error(`Error: SVG file not found at ${svgPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating PNGs...');
  
  // favicon-16x16.png
  const png16 = path.join(outDir, 'favicon-16x16.png');
  await sharp(svgBuffer).resize(16, 16).png().toFile(png16);
  
  // favicon-32x32.png
  const png32 = path.join(outDir, 'favicon-32x32.png');
  await sharp(svgBuffer).resize(32, 32).png().toFile(png32);

  // apple-touch-icon.png
  const appleTouch = path.join(outDir, 'apple-touch-icon.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile(appleTouch);

  // android chrome icons (192 and 512 are standard for manifest)
  const android192 = path.join(outDir, 'android-chrome-192x192.png');
  await sharp(svgBuffer).resize(192, 192).png().toFile(android192);
  
  const android512 = path.join(outDir, 'android-chrome-512x512.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile(android512);

  console.log('Generating favicon.ico...');
  // favicon.ico (combines 16 and 32)
  const icoBuffer = await pngToIco([png16, png32]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);

  console.log('Done! Favicons generated in', outDir);
}

generate().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
