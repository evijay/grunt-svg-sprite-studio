'use strict';

function generateStylesheet(iconsData, styleConfig) {
  const { format, baseClass, generateVariables } = styleConfig;
  const fmt = format.toLowerCase();

  let code = `/* Auto-generated SVG Sprite Stylesheet (${fmt.toUpperCase()}) */\n\n`;

  if (fmt === 'scss') {
    code += `.${baseClass} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  fill: currentColor;\n}\n\n`;
    if (generateVariables) {
      for (const icon of iconsData) {
        code += `$${icon.name}-width: ${icon.width}px;\n`;
        code += `$${icon.name}-height: ${icon.height}px;\n`;
      }
      code += '\n';
    }
    for (const icon of iconsData) {
      code += `.${baseClass}--${icon.name} {\n  /* symbol ID: ${icon.symbolId} */\n}\n`;
    }
  } else if (fmt === 'less') {
    code += `.${baseClass} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  fill: currentColor;\n}\n\n`;
    if (generateVariables) {
      for (const icon of iconsData) {
        code += `@${icon.name}-width: ${icon.width}px;\n`;
        code += `@${icon.name}-height: ${icon.height}px;\n`;
      }
      code += '\n';
    }
    for (const icon of iconsData) {
      code += `.${baseClass}--${icon.name} {\n  /* symbol ID: ${icon.symbolId} */\n}\n`;
    }
  } else if (fmt === 'stylus') {
    code += `.${baseClass}\n  display inline-block\n  width 1em\n  height 1em\n  fill currentColor\n\n`;
    if (generateVariables) {
      for (const icon of iconsData) {
        code += `$${icon.name}-width = ${icon.width}px\n`;
        code += `$${icon.name}-height = ${icon.height}px\n`;
      }
      code += '\n';
    }
    for (const icon of iconsData) {
      code += `.${baseClass}--${icon.name}\n  /* symbol ID: ${icon.symbolId} */\n`;
    }
  } else {
    // CSS
    code += `.${baseClass} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  fill: currentColor;\n}\n\n`;
    for (const icon of iconsData) {
      code += `.${baseClass}--${icon.name} {\n  width: ${icon.width}px;\n  height: ${icon.height}px;\n}\n`;
    }
  }

  return code;
}

module.exports = { generateStylesheet };