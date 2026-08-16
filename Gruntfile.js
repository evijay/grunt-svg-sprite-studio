'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    svg_sprite_studio: {
      options: {
        source: 'test/fixtures/**/*.svg',
        output: {
          directory: 'tmp/dist',
          sprite: 'icons.svg',
          format: 'optimized' //'pretty'
        },
        symbol: {
          prefix: 'icon-'
        },
        resize: {
          width: 24,
          height: 24,
          preserveAspectRatio: true
        },
        attributes: {
          fill: 'currentColor'
        },
        xmp: {
          enabled: true,
          creator: 'Design System Team',
          copyright: 'Copyright © 2026 Example Corp',
          license: 'MIT',
          description: 'Production SVG Symbol Sprite'
        },
        optimize: {
          enabled: false,
          precision: 2
        },
        styles: {
          enabled: true,
          format: 'scss',
          output: 'tmp/dist/_icons.scss',
          baseClass: 'icon',
          generateVariables: true
        }
      },
      build: {}
    }
  });

  grunt.loadTasks('tasks');
  grunt.registerTask('default', ['svg_sprite_studio']);
};