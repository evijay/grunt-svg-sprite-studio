'use strict';

function extractViewBoxDimensions(viewBoxStr) {
  if (!viewBoxStr) return null;
  const parts = viewBoxStr.trim().split(/[\s,]+/).map(Number);
  if (parts.length === 4 && !parts.some(isNaN)) {
    return { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
  }
  return null;
}

function transformSvgToSymbol(rawSvgContent, iconEntry, options) {
  // Extract root <svg ...> attributes and inner XML content using standard XML boundary extraction
  const svgMatch = rawSvgContent.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/i);
  
  if (!svgMatch) {
    throw new Error(`TransformError: Invalid SVG content in file ${iconEntry.filePath}`);
  }

  const svgAttrsStr = svgMatch[1];
  const innerContent = svgMatch[2].trim();

  // Parse width, height, viewBox attributes
  const widthMatch = svgAttrsStr.match(/\bwidth=["']([^"']+)["']/i);
  const heightMatch = svgAttrsStr.match(/\bheight=["']([^"']+)["']/i);
  const viewBoxMatch = svgAttrsStr.match(/\bviewBox=["']([^"']+)["']/i);

  let origWidth = widthMatch ? parseFloat(widthMatch[1]) : null;
  let origHeight = heightMatch ? parseFloat(heightMatch[1]) : null;
  let viewBoxStr = viewBoxMatch ? viewBoxMatch[1] : null;

  let viewBoxParsed = extractViewBoxDimensions(viewBoxStr);

  if (!viewBoxParsed && origWidth && origHeight) {
    viewBoxStr = `0 0 ${origWidth} ${origHeight}`;
    viewBoxParsed = { minX: 0, minY: 0, width: origWidth, height: origHeight };
  }

  const baseWidth = viewBoxParsed ? viewBoxParsed.width : (origWidth || 24);
  const baseHeight = viewBoxParsed ? viewBoxParsed.height : (origHeight || 24);

  let finalWidth = baseWidth;
  let finalHeight = baseHeight;

  if (options.resize.width && options.resize.height) {
    finalWidth = options.resize.width;
    finalHeight = options.resize.height;
  } else if (options.resize.width) {
    finalWidth = options.resize.width;
    finalHeight = options.resize.preserveAspectRatio ? (baseHeight * (options.resize.width / baseWidth)) : baseHeight;
  } else if (options.resize.height) {
    finalHeight = options.resize.height;
    finalWidth = options.resize.preserveAspectRatio ? (baseWidth * (options.resize.height / baseHeight)) : baseWidth;
  }

  const symbolId = `${options.symbol.prefix}${iconEntry.name}${options.symbol.suffix}`;
  const finalViewBox = viewBoxStr || `0 0 ${finalWidth} ${finalHeight}`;

  // Build custom symbol attributes string
  let customAttrsStr = '';
  for (const [key, val] of Object.entries(options.attributes)) {
    if (val !== null && val !== undefined) {
      customAttrsStr += ` ${key}="${val}"`;
    }
  }

  // Construct valid XML symbol string
  const symbolXml = `  <symbol id="${symbolId}" viewBox="${finalViewBox}"${customAttrsStr}>\n    ${innerContent}\n  </symbol>`;

  return {
    symbolXml,
    symbolId,
    width: Math.round(finalWidth * 100) / 100,
    height: Math.round(finalHeight * 100) / 100
  };
}

module.exports = { transformSvgToSymbol };