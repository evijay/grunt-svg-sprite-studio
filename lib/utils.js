'use strict';

const path = require('path');

function escapeXml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeIdentifier(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

module.exports = {
  escapeXml,
  sanitizeIdentifier,
  normalizePath
};