'use strict';

const path = require('path');
const { validateAndMergeConfig } = require('./config');
const { scanSourceFiles } = require('./scanner');
const { transformSvgToSymbol } = require('./transformer');
const { optimizeSvgString } = require('./optimizer');
const { assembleSprite } = require('./sprite');
const { generateStylesheet } = require('./styles');
const { writeOutput } = require('./writers');

function processSvgSprite(userOptions) {
  const options = validateAndMergeConfig(userOptions);
  const files = scanSourceFiles(options.source, options.exclude);

  if (files.length === 0) {
    return {
      found: 0,
      processed: 0,
      optimized: 0,
      spritePath: null,
      stylesPath: null
    };
  }

  const symbolXmlStrings = [];
  const iconsData = [];

  for (const fileEntry of files) {
    let rawContent = fileEntry.rawContent;

    // 1. Optimize raw SVG icon file via SVGO
    if (options.optimize.enabled) {
      rawContent = optimizeSvgString(rawContent, options.optimize);
    }

    // 2. Convert SVG into symbol XML string
    const { symbolXml, symbolId, width, height } = transformSvgToSymbol(rawContent, fileEntry, options);

    symbolXmlStrings.push(symbolXml);
    iconsData.push({
      name: fileEntry.name,
      symbolId,
      width,
      height
    });
  }

  // 3. Assemble full sprite SVG file
  const spriteContent = assembleSprite(symbolXmlStrings, options);

  // 4. Write outputs to disk
  const spriteOutPath = path.join(options.output.directory, options.output.sprite);
  writeOutput(spriteOutPath, spriteContent);

  let styleOutPath = null;
  if (options.styles.enabled) {
    const styleContent = generateStylesheet(iconsData, options.styles);
    styleOutPath = options.styles.output;
    writeOutput(styleOutPath, styleContent);
  }

  return {
    found: files.length,
    processed: files.length,
    optimized: options.optimize.enabled ? files.length : 0,
    spritePath: spriteOutPath,
    stylesPath: styleOutPath
  };
}

module.exports = { processSvgSprite };