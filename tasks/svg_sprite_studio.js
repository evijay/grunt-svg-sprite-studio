'use strict';

const { processSvgSprite } = require('../lib');

module.exports = function (grunt) {
  grunt.registerMultiTask('svg_sprite_studio', 'Generates optimized SVG symbol sprites and stylesheets.', function () {
    const options = this.options();

    grunt.log.writeln('\nSVG Sprite Generator');
    grunt.log.writeln('---------------------');

    try {
      const summary = processSvgSprite(options);

      grunt.log.writeln(`Found:      ${summary.found} SVG files`);
      grunt.log.writeln(`Processed:  ${summary.processed}`);
      grunt.log.writeln(`Optimized:  ${summary.optimized}`);
      if (summary.spritePath) grunt.log.writeln(`Sprite:     ${summary.spritePath}`);
      if (summary.stylesPath) grunt.log.writeln(`Styles:     ${summary.stylesPath}`);
      grunt.log.ok('Completed successfully.');
    } catch (err) {
      grunt.log.error(err.message);
      grunt.fail.warn('SVG Sprite Generation failed.');
    }
  });
};