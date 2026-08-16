'use strict';

const { optimize } = require('svgo');

function optimizeSvgString(svgContent, optimizeConfig) {
  if (!optimizeConfig || !optimizeConfig.enabled) {
    return svgContent;
  }

  try {
    const result = optimize(svgContent, {
      js2svg: {
        indent: 2,
        pretty: false
      },
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false, // Ensure viewBox is never stripped
              cleanupIds: false     // Ensure path IDs are preserved
            }
          }
        },
        {
          name: 'cleanupNumericValues',
          params: {
            floatPrecision: optimizeConfig.precision || 2
          }
        },
        ...(optimizeConfig.plugins || [])
      ]
    });

    return result.data;
  } catch (err) {
    // If SVGO optimization fails on a complex file, fall back to raw content safely
    return svgContent;
  }
}

module.exports = { optimizeSvgString };