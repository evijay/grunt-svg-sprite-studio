```python
import os

# Create directory structure for single file SKILL creation or direct output
os.makedirs('/tmp/output', exist_ok=True)

markdown_content = """# Grunt SVG Sprite Studio Complete Documentation

`grunt-svg-sprite-studio` is a production-ready Grunt task/plugin that scans source directories for SVG vector graphics, transforms and resizes them, inserts XML/XMP copyright metadata, optimizes vector paths via SVGO, and outputs a unified SVG symbol sprite along with matching preprocessor stylesheets (SCSS, LESS, Stylus, CSS).

---

## Table of Contents

1. [Overview & Architecture](#overview--architecture)
2. [Installation](#installation)
3. [Quick Start Example](#quick-start-example)
4. [Complete Configuration Guide](#complete-configuration-guide)
   - [Top-Level Options](#top-level-options)
   - [output Configuration](#output-configuration)
   - [symbol Configuration](#symbol-configuration)
   - [resize Configuration](#resize-configuration)
   - [attributes Configuration](#attributes-configuration)
   - [xmp Configuration (XML/XMP Metadata)](#xmp-configuration-xmlxmp-metadata)
   - [optimize Configuration (SVGO Integration)](#optimize-configuration-svgo-integration)
   - [styles Configuration (Stylesheet Generator)](#styles-configuration-stylesheet-generator)
5. [Full Gruntfile Example](#full-gruntfile-example)
6. [HTML Usage Patterns](#html-usage-patterns)
7. [Error Handling & Edge Cases](#error-handling--edge-cases)
8. [CLI Output Example](#cli-output-example)

---

## Overview & Architecture

`grunt-svg-sprite-studio` is built as a modular JavaScript pipeline designed for high-performance frontend build chains.


```

Source SVG Files (.svg)
│
▼
[1. Scanner] ──────▶ Discovers files recursively, sanitizes icon names, checks collisions
│
▼
[2. Parser]  ──────▶ Strict DOM/XML parsing via fast-xml-parser
│
▼
[3. Transformer] ──▶ Extracts viewBox, applies custom sizing, injects global attributes
│
▼
[4. Metadata]   ───▶ Generates valid Adobe/Creative Commons XMP XML metadata
│
▼
[5. Sprite Engine] ─▶ Assembles SVG  sprite container deterministically
│
▼
[6. Optimizer]  ───▶ Runs SVGO (precision, path cleanup) preserving XMP & symbol IDs
│
▼
[7. Style Generator]▶ Generates SCSS / LESS / Stylus / CSS with dimension variables
│
▼
[8. Writers] ──────▶ Creates output directories safely and writes final files

```

---

## Installation

```bash
npm install grunt-svg-sprite-studio --save-dev

```

### Dependencies Included

* **`fast-xml-parser`**: Provides true DOM-level XML parsing to ensure XML validity without fragile regex.
* **`svgo`**: Standard SVG optimization engine for cleaning attributes and compacting path data.
* **`glob`**: High-performance recursive glob file matching.

---

## Quick Start Example

Add the task to your `Gruntfile.js`:

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    svg_sprite_studio: {
      options: {
        source: 'src/icons/**/*.svg',
        output: {
          directory: 'dist',
          sprite: 'icons.svg',
          format: 'optimized'
        },
        styles: {
          enabled: true,
          format: 'scss',
          output: 'dist/_icons.scss'
        }
      },
      build: {}
    }
  });

  grunt.loadNpmTasks('grunt-svg-sprite-studio');
  grunt.registerTask('default', ['svg_sprite_studio']);
};

```

---

## Complete Configuration Guide

Below is an exhaustive breakdown of every configuration option available in `grunt-svg-sprite-studio`.

---

### Top-Level Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `source` | `String` | `Array` | `'src/icons/**/*.svg'` | Glob pattern or array of patterns defining where source SVG files are located. |
| `exclude` | `Array` | `[]` | Array of glob patterns to exclude from scanning (e.g., `['**/temp/**', '**/drafts/**']`). |
| `removeAttributeKeys` | `Array` | `['xmlns', 'xmlns:xlink']` | Attribute names stripped from root elements during symbol conversion to prevent namespace conflicts inside the sprite. |
| `debug` | `Boolean` | `false` | When set to `true`, inserts HTML/XML comments inside generated `<symbol>` nodes indicating original source file paths. |

---

### `output` Configuration

Controls sprite destination and formatting modes.

```javascript
output: {
  directory: "dist",
  sprite: "icons.svg",
  format: "optimized"
}

```

| Property | Type | Default | Options | Description |
| --- | --- | --- | --- | --- |
| `directory` | `String` | `'dist'` | Any valid path | Target directory where the generated sprite and asset output will be placed. Created automatically if missing. |
| `sprite` | `String` | `'icons.svg'` | Any `.svg` filename | Name of the output SVG sprite file. |
| `format` | `String` | `'optimized'` | `'optimized'`, `'pretty'` | Controls formatting. `'pretty'` outputs indented XML (ideal for debugging); `'optimized'` produces minified markup. |

---

### `symbol` Configuration

Defines symbol ID formatting rules inside the generated sprite.

```javascript
symbol: {
  prefix: "icon-",
  suffix: ""
}

```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `prefix` | `String` | `'icon-'` | String prefixed to every generated `<symbol id="...">`. |
| `suffix` | `String` | `''` | String appended to every generated `<symbol id="...">`. |

*Example:* A file named `user-profile.svg` with `prefix: "ic-"` and `suffix: "-v1"` produces `<symbol id="ic-user-profile-v1">`.

---

### `resize` Configuration

Controls icon resizing, aspect ratio preservation, and coordinate system calculations.

```javascript
resize: {
  width: 24,
  height: 24,
  preserveAspectRatio: true,
  allowDistortion: false
}

```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `Number` | `null` | `null` | Target width in pixels. If `height` is omitted and `preserveAspectRatio` is `true`, height auto-scales proportional to original dimensions. |
| `height` | `Number` | `null` | `null` | Target height in pixels. If `width` is omitted and `preserveAspectRatio` is `true`, width auto-scales proportional to original dimensions. |
| `preserveAspectRatio` | `Boolean` | `true` | When `true`, prevents unequal stretching if only one dimension is specified or if new dimensions differ from aspect ratio. |
| `allowDistortion` | `Boolean` | `false` | Must be explicitly set to `true` to force independent width/height scaling if forced dimensions alter original aspect ratios. Applies `preserveAspectRatio="none"` on the `<symbol>`. |

---

### `attributes` Configuration

Global SVG attribute injections applied to every `<symbol>` element.

```javascript
attributes: {
  fill: "currentColor",
  "stroke-width": "2",
  class: "sprite-symbol"
}

```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `[key: string]` | `String` | `Number` | `{}` | Key-value dictionary of SVG attributes (e.g. `fill`, `stroke`, `stroke-width`, `fill-rule`, `clip-rule`, `preserveAspectRatio`). Explicitly setting a key to `null` removes it. |

---

### `xmp` Configuration (XML/XMP Metadata)

Injects standardized Adobe / Creative Commons XMP metadata tags into the top `<metadata>` tag of the SVG sprite. All strings are automatically XML-escaped.

```javascript
xmp: {
  enabled: true,
  creator: "Example Design Systems",
  copyright: "Copyright © 2026 Example Corp",
  rights: "All Rights Reserved",
  license: "[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)",
  description: "Core UI Icon Library",
  title: "UI Icon Sprite",
  source: "[https://github.com/example/design-system](https://github.com/example/design-system)",
  customProperties: {
    department: "Frontend Guild",
    buildNumber: "1042"
  }
}

```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `Boolean` | `false` | Set to `true` to embed XMP metadata into the generated SVG sprite. |
| `creator` | `String` | `''` | Populates `<dc:creator>`. Author or company name. |
| `copyright` | `String` | `''` | Populates `<dc:rights>`. Legal copyright notice. |
| `rights` | `String` | `''` | Populates `<cc:morePermissions>`. Usage terms or rights statement. |
| `license` | `String` | `''` | Populates `<cc:license>`. URI or name of the license (e.g. MIT, CC-BY-4.0). |
| `description` | `String` | `''` | Populates `<dc:description>`. Brief description of the icon library. |
| `title` | `String` | `''` | Populates `<dc:title>`. Document title. |
| `source` | `String` | `''` | Populates `<dc:source>`. Repository or source URL. |
| `customProperties` | `Object` | `{}` | Key-value object transformed into custom XML elements under the `xmlns:ext` namespace. |

---

### `optimize` Configuration (SVGO Integration)

Integrates SVGO directly into the build pipeline. Optimization executes **after** symbol conversion and XMP assembly to ensure metadata and symbol IDs are preserved.

```javascript
optimize: {
  enabled: true,
  precision: 2,
  plugins: [
    "removeTitle",
    "removeDesc"
  ]
}

```

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | `Boolean` | `true` | Enables or disables SVGO path and vector optimization. |
| `precision` | `Number` | `2` | Number of decimal places used when rounding floating point numeric path coordinates. Lower values reduce file size. |
| `plugins` | `Array` | `[]` | Additional SVGO plugin names or configuration objects passed directly to SVGO engine. |

---

### `styles` Configuration (Stylesheet Generator)

Generates matching preprocessor stylesheets containing base utility classes, icon modifier classes, symbol references, and width/height dimension variables.

```javascript
styles: {
  enabled: true,
  format: "scss",
  output: "dist/_icons.scss",
  baseClass: "icon",
  generateVariables: true
}

```

| Property | Type | Default | Options | Description |
| --- | --- | --- | --- | --- |
| `enabled` | `Boolean` | `true` | `'true'`, `'false'` | Set to `true` to generate matching stylesheet file. |
| `format` | `String` | `'scss'` | `'css'`, `'scss'`, `'less'`, `'stylus'` | Output stylesheet preprocessor language format. |
| `output` | `String` | `'dist/icons.scss'` | Any valid file path | Exact output path for generated stylesheet. |
| `baseClass` | `String` | `'icon'` | Any valid CSS class | Base CSS class selector applied to all icons. |
| `generateVariables` | `Boolean` | `true` | `'true'`, `'false'` | Generates preprocessor variables containing icon dimensions (e.g., `$home-width: 24px;`). |

---

#### Output Stylesheet Examples by Format

##### 1. SCSS (`format: "scss"`)

```scss
/* Auto-generated SVG Sprite Stylesheet (SCSS) */

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

$home-width: 24px;
$home-height: 24px;

.icon--home {
  /* symbol ID: icon-home */
}

```

##### 2. LESS (`format: "less"`)

```less
/* Auto-generated SVG Sprite Stylesheet (LESS) */

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

@home-width: 24px;
@home-height: 24px;

.icon--home {
  /* symbol ID: icon-home */
}

```

##### 3. Stylus (`format: "stylus"`)

```stylus
/* Auto-generated SVG Sprite Stylesheet (STYLUS) */

.icon
  display inline-block
  width 1em
  height 1em
  fill currentColor

$home-width = 24px
$home-height = 24px

.icon--home
  /* symbol ID: icon-home */

```

##### 4. CSS (`format: "css"`)

```css
/* Auto-generated SVG Sprite Stylesheet (CSS) */

.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}

.icon--home {
  width: 24px;
  height: 24px;
}

```

---

## Full Gruntfile Example

```javascript
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    svg_sprite_studio: {
      options: {
        // Input discovery
        source: ['src/assets/icons/**/*.svg'],
        exclude: ['**/drafts/**', '**/unused/**'],
        debug: false,

        // Output sprite settings
        output: {
          directory: 'dist/assets',
          sprite: 'sprite.svg',
          format: 'optimized' // 'pretty' | 'optimized'
        },

        // Symbol options
        symbol: {
          prefix: 'icon-',
          suffix: ''
        },

        // Uniform resizing
        resize: {
          width: 24,
          height: 24,
          preserveAspectRatio: true,
          allowDistortion: false
        },

        // Default attributes across symbols
        attributes: {
          fill: 'currentColor'
        },

        // XMP Copyright Metadata Injection
        xmp: {
          enabled: true,
          title: 'Design System Icons',
          creator: 'Enterprise Design System Team',
          copyright: 'Copyright © 2026 Enterprise Corp',
          rights: 'All Rights Reserved',
          license: '[https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)',
          description: 'Vector SVG symbol sprite for application UI',
          source: '[https://github.com/enterprise/design-system](https://github.com/enterprise/design-system)',
          customProperties: {
            environment: 'production',
            version: '2.4.0'
          }
        },

        // SVGO Optimization Settings
        optimize: {
          enabled: true,
          precision: 2,
          plugins: ['removeTitle', 'removeDesc']
        },

        // Preprocessor Stylesheet Generation
        styles: {
          enabled: true,
          format: 'scss', // 'css' | 'scss' | 'less' | 'stylus'
          output: 'src/styles/abstracts/_generated-icons.scss',
          baseClass: 'icon',
          generateVariables: true
        }
      },
      dev: {
        options: {
          output: { format: 'pretty' },
          optimize: { enabled: false }
        }
      },
      prod: {
        options: {
          output: { format: 'optimized' },
          optimize: { enabled: true }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-svg-sprite-studio');
  grunt.registerTask('build:dev', ['svg_sprite_studio:dev']);
  grunt.registerTask('build:prod', ['svg_sprite_studio:prod']);
  grunt.registerTask('default', ['build:prod']);
};

```

---

## HTML Usage Patterns

Once built, reference icons anywhere in your HTML or component templates using standard SVG `<use>` elements:

### 1. Basic Symbol Reference

```html
<svg class="icon icon--home">
  <use href="dist/assets/sprite.svg#icon-home"></use>
</svg>

```

### 2. Sizing with SCSS Variables

If `$home-width` and `$home-height` are generated:

```scss
.button-icon {
  width: $home-width;
  height: $home-height;
}

```

```html
<button class="btn">
  <svg class="icon button-icon">
    <use href="dist/assets/sprite.svg#icon-home"></use>
  </svg>
  <span>Home</span>
</button>

```

---

## Error Handling & Edge Cases

The task catches build errors and prints informative messages:

1. **`DuplicateIconNameError`**: Triggered if two icons across different subdirectories sanitize to the same name (e.g. `nav/home.svg` and `footer/HOME.svg`).
2. **`ParseError`**: Triggered when encountering empty files, invalid XML tags, or unclosed elements.
3. **`ConfigError`**: Triggered when an unsupported preprocessor format (e.g., `format: "sass"`) or output mode is specified.
4. **`WriteError`**: Triggered if output directories cannot be created due to permission issues or invalid paths.

---

## CLI Output Example

When running `grunt svg_sprite_studio`:

```text
Running "svg_sprite_studio:prod" (svg_sprite_studio) task

SVG Sprite Generator
---------------------
Found:      42 SVG files
Processed:  42
Optimized:  42
Sprite:     dist/assets/sprite.svg
Styles:     src/styles/abstracts/_generated-icons.scss
>> Completed successfully.

Done.
"""

file_path = '/tmp/output/GRUNT_SVG_SPRITE_STUDIO_DOCS.md'
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(markdown_content)

print(f"File generated successfully at: {file_path}")


```

```text
File generated successfully at: /tmp/output/GRUNT_SVG_SPRITE_STUDIO_DOCS.md


```

I have created a comprehensive Markdown documentation file detailing **every configuration option, workflow pipeline, architecture layer, and code example** for the Grunt SVG Sprite plugin.

The complete Markdown documentation file has been generated and saved:

[file-tag: code-generated-file-GRUNT_SVG_SPRITE_STUDIO_DOCS.md]

---

### Quick Preview of the Documentation

Below is a summary of the option sections included in the generated file:

#### 1. Top-Level Options

* `source`: Glob string or array of source SVG file patterns.
* `exclude`: Array of glob patterns to ignore during directory traversal.
* `removeAttributeKeys`: Attribute names stripped from root elements during symbol conversion (`xmlns`, `xmlns:xlink`).
* `debug`: Embeds original file paths as XML comments inside `<symbol>` nodes.

#### 2. `output` Options

* `directory`: Target output directory.
* `sprite`: Sprite file name (e.g., `icons.svg`).
* `format`: Output formatting (`"optimized"` vs `"pretty"`).

#### 3. `symbol` Options

* `prefix`: ID prefix added to each generated symbol (e.g., `icon-`).
* `suffix`: Optional ID suffix added to each symbol.

#### 4. `resize` Options

* `width` & `height`: Uniform dimension targets.
* `preserveAspectRatio`: Maintains aspect ratio scaling when resizing single axes.
* `allowDistortion`: Allows independent width/height non-proportional scaling when set to `true`.

#### 5. `attributes` Options

* Dictionary of global attribute overrides added to `<symbol>` nodes (`fill`, `stroke`, `stroke-width`, `class`, etc.).

#### 6. `xmp` Metadata Options

* `enabled`: Embeds XMP metadata into the sprite's `<metadata>` block.
* Standard fields: `creator`, `copyright`, `rights`, `license`, `description`, `title`, `source`.
* `customProperties`: Key-value object transformed into custom XML elements under `xmlns:ext`.

#### 7. `optimize` Options (SVGO Integration)

* `enabled`: Enables/disables SVGO path optimization.
* `precision`: Number of decimal points for floating-point path coordinates.
* `plugins`: Additional SVGO plugin names or configuration objects.

#### 8. `styles` Options (Stylesheet Generator)

* `enabled`: Toggles stylesheet generation.
* `format`: Output preprocessor format (`"scss"`, `"less"`, `"stylus"`, or `"css"`).
* `output`: Output destination path for the generated stylesheet.
* `baseClass`: Base CSS selector class name (default: `"icon"`).
* `generateVariables`: Toggles output of icon dimension variables (e.g. `$home-width: 24px;`).