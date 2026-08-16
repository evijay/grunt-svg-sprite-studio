'use strict';

const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { sanitizeIdentifier, normalizePath } = require('./utils');

function scanSourceFiles(pattern, excludePatterns = []) {
  const globOptions = {
    ignore: excludePatterns,
    nodir: true,
    absolute: true
  };

  const files = glob.sync(pattern, globOptions).sort();

  if (files.length === 0) {
    return [];
  }

  const nameCounts = new Map();
  const fileEntries = [];

  for (const filePath of files) {
    const ext = path.extname(filePath);
    if (ext.toLowerCase() !== '.svg') continue;

    const baseName = path.basename(filePath, ext);
    const cleanName = sanitizeIdentifier(baseName);

    if (nameCounts.has(cleanName)) {
      const prevPath = nameCounts.get(cleanName);
      throw new Error(`DuplicateIconNameError: Icon name collision "${cleanName}" between:\n  1: ${prevPath}\n  2: ${filePath}`);
    }

    nameCounts.set(cleanName, filePath);
    fileEntries.push({
      name: cleanName,
      filePath: normalizePath(filePath),
      rawContent: fs.readFileSync(filePath, 'utf8')
    });
  }

  return fileEntries;
}

module.exports = { scanSourceFiles };