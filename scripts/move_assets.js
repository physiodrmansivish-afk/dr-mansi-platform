const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../assets');
const publicImagesDir = path.join(__dirname, '../public/media/images');
const publicVideosDir = path.join(__dirname, '../public/media/videos');

// Ensure directories exist
if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true });
if (!fs.existsSync(publicVideosDir)) fs.mkdirSync(publicVideosDir, { recursive: true });

const files = fs.readdirSync(assetsDir);

let imageCount = 1;
let videoCount = 1;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const oldPath = path.join(assetsDir, file);

  if (file === 'Testimonial.mp4' || file === 'Testimonial.mp4') {
    fs.copyFileSync(oldPath, path.join(publicVideosDir, 'testimonial.mp4'));
  } else if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    // skip head shot if we already moved it, or move it again
    if (file.toLowerCase().includes('head shot')) continue;
    
    fs.copyFileSync(oldPath, path.join(publicImagesDir, `work-${imageCount}${ext}`));
    imageCount++;
  } else if (ext === '.mp4' || ext === '.mov') {
    fs.copyFileSync(oldPath, path.join(publicVideosDir, `video-${videoCount}${ext}`));
    videoCount++;
  }
}

console.log(`Copied ${imageCount - 1} images and ${videoCount - 1} videos.`);
