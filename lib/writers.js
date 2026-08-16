'use strict';

const fs = require('fs');
const path = require('path');

function writeOutput(filePath, content) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (err) {
    throw new Error(`WriteError: Failed to write output file at "${filePath}": ${err.message}`);
  }
}

module.exports = { writeOutput };