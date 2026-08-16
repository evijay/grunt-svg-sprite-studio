'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { processSvgSprite } = require('../lib');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const TMP_DIR = path.join(__dirname, '../tmp/test_out');

function setupFixtures() {
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FIXTURES_DIR, { recursive: true });

  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'home.svg'),
    '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>'
  );

  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'user.svg'),
    '<svg width="32" height="32"><circle cx="16" cy="16" r="10"/></svg>'
  );
}

test('SVG Sprite Generator - Suite', async (t) => {
  setupFixtures();

  await t.test('Builds sprite and SCSS correctly', () => {
    const res = processSvgSprite({
      source: `${FIXTURES_DIR}/*.svg`,
      output: { directory: TMP_DIR, sprite: 'test-sprite.svg', format: 'pretty' },
      styles: { enabled: true, format: 'scss', output: path.join(TMP_DIR, '_icons.scss') },
      xmp: { enabled: true, creator: 'Test Unit' }
    });

    assert.equal(res.found, 2);
    assert.ok(fs.existsSync(res.spritePath));
    assert.ok(fs.existsSync(res.stylesPath));

    const spriteContent = fs.readFileSync(res.spritePath, 'utf8');
    assert.ok(spriteContent.includes('id="icon-home"'));
    assert.ok(spriteContent.includes('id="icon-user"'));
    assert.ok(spriteContent.includes('<x:xmpmeta'));

    const scssContent = fs.readFileSync(res.stylesPath, 'utf8');
    assert.ok(scssContent.includes('$home-width: 24px;'));
    assert.ok(scssContent.includes('.icon--home'));
  });

  await t.test('Detects duplicate names safely', () => {
    const duplicateDir = path.join(TMP_DIR, 'dupes');
    fs.mkdirSync(duplicateDir, { recursive: true });
    fs.writeFileSync(path.join(duplicateDir, 'icon.svg'), '<svg></svg>');
    fs.writeFileSync(path.join(duplicateDir, 'ICON.svg'), '<svg></svg>');

    assert.throws(() => {
      processSvgSprite({ source: `${duplicateDir}/*.svg` });
    }, /DuplicateIconNameError/);
  });
});