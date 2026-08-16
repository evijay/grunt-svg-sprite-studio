'use strict';

const { generateXmpMetadata } = require('./metadata');

function assembleSprite(symbolXmlStrings, options) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none;">\n`;

  // Inject XMP Metadata if enabled
  const xmpNode = generateXmpMetadata(options.xmp);
  if (xmpNode && xmpNode.metadata && xmpNode.metadata[1]) {
    xml += `  <metadata id="xmp-metadata">\n`;
    xml += `    ${xmpNode.metadata[1]['#text'].replace(/\n/g, '\n    ')}\n`;
    xml += `  </metadata>\n`;
  }

  // Append all symbol blocks
  for (const symbolXml of symbolXmlStrings) {
    xml += `${symbolXml}\n`;
  }

  xml += `</svg>`;

  return xml;
}

module.exports = { assembleSprite };