const axios = require('axios');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const imageUrl = 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1000&q=80';
const outputPath = path.resolve('public/right_sushi_plate.png');

console.log('Downloading sushi image from:', imageUrl);

axios({
  method: 'get',
  url: imageUrl,
  responseType: 'arraybuffer'
})
  .then(response => {
    return Jimp.read(Buffer.from(response.data));
  })
  .then(image => {
    console.log('Image downloaded. Dimensions:', image.bitmap.width, 'x', image.bitmap.height);
    
    // Crop to center square (562x562) to remove horizontal empty space
    const size = Math.min(image.bitmap.width, image.bitmap.height);
    const x = Math.floor((image.bitmap.width - size) / 2);
    const y = Math.floor((image.bitmap.height - size) / 2);
    
    console.log(`Cropping to square at: X=${x}, Y=${y}, Size=${size}x${size}`);
    image.crop({ x, y, w: size, h: size });
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = image.bitmap.data;
    
    // Visited set for BFS background removal
    const visited = new Uint8Array(width * height);
    const queue = [];
    
    const getIdx = (x, y) => (y * width + x) * 4;
    
    // Check if pixel is light background (> 215)
    const isLightBackground = (x, y) => {
      const idx = getIdx(x, y);
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      return a > 0 && r > 215 && g > 215 && b > 215;
    };
    
    // Add corners to BFS queue
    const addPixel = (x, y) => {
      const index = y * width + x;
      if (!visited[index] && isLightBackground(x, y)) {
        visited[index] = 1;
        queue.push({ x, y });
      }
    };
    
    // Edges
    for (let x = 0; x < width; x++) {
      addPixel(x, 0);
      addPixel(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      addPixel(0, y);
      addPixel(width - 1, y);
    }
    
    // BFS traversal
    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];
    let converted = 0;
    
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      converted++;
      
      const idx = getIdx(x, y);
      data[idx + 3] = 0; // Transparent
      
      for (let i = 0; i < 4; i++) {
        const nx = x + dx[i];
        const ny = y + dy[i];
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx] && isLightBackground(nx, ny)) {
            visited[nIdx] = 1;
            queue.push({ x: nx, y: ny });
          }
        }
      }
    }
    
    console.log(`Converted ${converted} background pixels to transparent.`);
    
    // Save square image
    return image.write(outputPath);
  })
  .then(() => {
    console.log('Successfully saved cropped, transparent rectangular sushi plate to:', outputPath);
  })
  .catch(err => {
    console.error('Error downloading or processing sushi plate:', err);
  });
