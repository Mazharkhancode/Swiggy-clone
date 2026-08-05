const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pdfPath = 'C:\\Users\\Admin1\\.gemini\\antigravity-ide\\brain\\41b9efdf-cc1a-43ed-9c89-32fabe12ef0f\\media__1785759616516.pdf';

console.log('Installing pdf-parse temporarily...');
try {
  execSync('npm install pdf-parse', { stdio: 'inherit' });
  
  const pdfParse = require('pdf-parse');
  const parser = new pdfParse.PDFParse();
  const dataBuffer = fs.readFileSync(pdfPath);
  
  const res = parser.load(dataBuffer);
  
  const handleParsing = () => {
    try {
      console.log('\n=== PDF TEXT CONTENT ===');
      console.log(parser.getText());
      console.log('========================\n');
      
      // Clean up
      console.log('Uninstalling pdf-parse...');
      execSync('npm uninstall pdf-parse', { stdio: 'inherit' });
    } catch (e) {
      console.error('Error during getText:', e);
    }
  };

  if (res && typeof res.then === 'function') {
    res.then(handleParsing).catch(err => console.error('Load error:', err));
  } else {
    handleParsing();
  }
} catch (err) {
  console.error('Error:', err.message);
}
