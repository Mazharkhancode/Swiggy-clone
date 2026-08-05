const fs = require('fs');

const extractTextFromPDF = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    const text = data.toString('binary');
    
    console.log(`=== Reading PDF: ${filePath} (${data.length} bytes) ===`);
    
    // Regular expression to match simple plain text in PDF streams (between parentheses in BT/ET streams)
    const matches = [];
    const rx = /\(([^)]+)\)\s*T[jJ]/g;
    let match;
    while ((match = rx.exec(text)) !== null) {
      matches.push(match[1]);
    }
    
    if (matches.length > 0) {
      console.log('Found PDF Text Content:');
      console.log(matches.join(' ').replace(/\\([\d\w]{3})/g, '')); // Basic octal escape removal
    } else {
      // Fallback: search for readable sentences or words
      const cleanText = text.replace(/[^\x20-\x7E\s]/g, ' ');
      const words = cleanText.split(/\s+/).filter(w => w.length > 3 && /^[a-zA-Z]+$/.test(w));
      console.log('No direct Tj matches. Dominant words in binary:');
      console.log(Array.from(new Set(words)).slice(0, 50).join(', '));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
};

extractTextFromPDF('C:\\Users\\Admin1\\Downloads\\Untitled document.pdf');
extractTextFromPDF('C:\\Users\\Admin1\\Downloads\\Untitled document (1).pdf');
