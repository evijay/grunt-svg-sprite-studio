'use strict';

const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  preserveOrder: true,
  commentPropName: '#comment',
  textNodeName: '#text'
});

function parseSvg(rawXml, filePath) {
  if (!rawXml || !rawXml.trim()) {
    throw new Error(`ParseError: File is empty: ${filePath}`);
  }

  try {
    const parsed = parser.parse(rawXml);
    let rootSvgChildren = null;

    for (const item of parsed) {
      if (item.svg) {
        rootSvgChildren = item.svg;
        break;
      }
    }

    if (!rootSvgChildren) {
      throw new Error(`ParseError: No root <svg> element found in ${filePath}`);
    }

    return rootSvgChildren;
  } catch (err) {
    throw new Error(`ParseError: Failed parsing XML for ${filePath}: ${err.message}`);
  }
}

module.exports = { parseSvg };