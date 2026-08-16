'use strict';

const path = require('path');

const DEFAULT_OPTIONS = {
  source: 'src/icons/**/*.svg',
  exclude: [],
  output: {
    directory: 'dist',
    sprite: 'icons.svg',
    format: 'optimized' // 'optimized' | 'pretty'
  },
  symbol: {
    prefix: 'icon-',
    suffix: ''
  },
  resize: {
    width: null,
    height: null,
    preserveAspectRatio: true,
    allowDistortion: false
  },
  attributes: {},
  removeAttributeKeys: ['xmlns', 'xmlns:xlink'],
  xmp: {
    enabled: false,
    creator: '',
    copyright: '',
    rights: '',
    license: '',
    description: '',
    title: '',
    source: '',
    customProperties: {}
  },
  optimize: {
    enabled: true,
    precision: 2,
    plugins: []
  },
  styles: {
    enabled: true,
    format: 'scss', // 'css' | 'scss' | 'less' | 'stylus'
    output: 'dist/icons.scss',
    baseClass: 'icon',
    generateVariables: true
  },
  debug: false
};

function validateAndMergeConfig(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
    output: { ...DEFAULT_OPTIONS.output, ...(userOptions.output || {}) },
    symbol: { ...DEFAULT_OPTIONS.symbol, ...(userOptions.symbol || {}) },
    resize: { ...DEFAULT_OPTIONS.resize, ...(userOptions.resize || {}) },
    attributes: { ...DEFAULT_OPTIONS.attributes, ...(userOptions.attributes || {}) },
    xmp: { ...DEFAULT_OPTIONS.xmp, ...(userOptions.xmp || {}) },
    optimize: { ...DEFAULT_OPTIONS.optimize, ...(userOptions.optimize || {}) },
    styles: { ...DEFAULT_OPTIONS.styles, ...(userOptions.styles || {}) }
  };

  if (!options.source) {
    throw new Error('ConfigError: "source" glob pattern or path must be defined.');
  }

  const validFormats = ['css', 'scss', 'less', 'stylus'];
  if (options.styles.enabled && !validFormats.includes(options.styles.format.toLowerCase())) {
    throw new Error(`ConfigError: Unsupported stylesheet format "${options.styles.format}". Valid formats: ${validFormats.join(', ')}`);
  }

  if (!['optimized', 'pretty'].includes(options.output.format)) {
    throw new Error(`ConfigError: Invalid output format "${options.output.format}". Allowed values are "optimized" or "pretty".`);
  }

  return options;
}

module.exports = {
  validateAndMergeConfig,
  DEFAULT_OPTIONS
};