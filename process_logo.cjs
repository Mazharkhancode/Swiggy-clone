const { Jimp } = require('jimp');
const path = require('path');

const inputPath = 'C:\\Users\\Admin1\\.gemini\\antigravity-ide\\brain\\ab58b4a6-bcf8-4c3b-9589-219eb234bbe7\\media__1785839490378.jpg';
const outputPath = path.resolve('public/swiggy_logo.png');

Jimp.read(inputPath)
  .then(image => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = image.bitmap.data;
    
    // Visited array for BFS background removal
    const visited = new Uint8Array(width * height);
    const queue = [];
    
    const getIdx = (x, y) => (y * width + x) * 4;
    
    const isWhite = (x, y) => {
      const idx = getIdx(x, y);
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      return a > 0 && r > 240 && g > 240 && b > 240;
    };
    
    const addPixel = (x, y) => {
      const index = y * width + x;
      if (!visited[index] && isWhite(x, y)) {
        visited[index] = 1;
        queue.push({ x, y });
      }
    };
    
    // Add edges to BFS queue
    for (let x = 0; x < width; x++) {
      addPixel(x, 0);
      addPixel(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      addPixel(0, y);
      addPixel(width - 1, y);
    }
    
    // BFS transparent fill
    const dx = [-1, 1, 0, 0];
    const dy = [0, 0, -1, 1];
    let converted = 0;
    
    while (queue.length > 0) {
      const { x, y } = queue.shift();
      converted++;
      
      const idx = getIdx(x, y);
      data[idx + 3] = 0; // Make transparent
      
      for (let i = 0; i < 4; i++) {
        const nx = x + dx[i];
        const ny = y + dy[i];
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx] && isWhite(nx, ny)) {
            visited[nIdx] = 1;
            queue.push({ x: nx, y: ny });
          }
        }
      }
    }
    
    console.log(`Converted ${converted} white pixels to transparent.`);
    
    // Find dominant color of non-transparent pixels
    let rSum = 0, gSum = 0, bSum = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
        count++;
      }
    }
    
    if (count > 0) {
      console.log(`Dominant logo color: R=${Math.round(rSum/count)}, G=${Math.round(gSum/count)}, B=${Math.round(bSum/count)}`);
    }
    
    return image.write(outputPath);
  })
  .then(() => {
    console.log('Saved transparent logo successfully to:', outputPath);
  })
  .catch(err => {
    console.error('Error processing logo:', err);
  });
