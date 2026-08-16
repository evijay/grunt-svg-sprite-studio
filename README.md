# grunt-svg-sprite-studio

> A Grunt plugin for generating sitemaps

[![npm version](https://shields.io)](https://npmjs.com)  [![npm license](https://shields.io)](https://npmjs.com)  [![npm downloads](https://shields.io)](https://npmjs.com)  [![npm downloads monthly](https://shields.io)](https://npmjs.com)  [![node version](https://shields.io)](https://npmjs.com)

> Production-ready Grunt task that compiles SVG icon folders into unified `<symbol>` SVG sprites with SCSS, LESS, Stylus, or CSS stylesheets and embedded XMP metadata.

## Features

- **Strict XML Parsing**: Employs DOM/XML parsing via `fast-xml-parser` to eliminate malformed XML errors.
- **XMP Metadata Support**: Embeds license, copyright, creator, and custom metadata directly into the sprite.
- **SVGO Integration**: Optimizes path data without stripping out metadata or symbol `<use>` bindings.
- **Multi-Preprocessor Styles**: Outputs SCSS, LESS, Stylus, or plain CSS variables and selectors.
- **Deterministic Build**: Alphabetical sorting guarantees zero diff noise in Git/CI pipelines.

## Getting Started

This plugin requires Grunt `>=1.6.1`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, which explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins.

Once you're familiar with that process, you can install this plugin with this command:

```bash
npm install grunt-svg-sprite-studio --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```bash
grunt.loadNpmTasks("grunt-svg-sprite-studio");
```

## The "svg_sprite_studio" Task

### Overview

In your project's `Gruntfile.js`, add a section named `svg_sprite_studio` to the data object passed into `grunt.initConfig()`.

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    svg_sprite_studio: {
      options: {
        source: "src/icons/**/*.svg",
        output: {
          directory: "dist",
          sprite: "icons.svg",
          format: "optimized"
        },
        styles: {
          enabled: true,
          format: "scss",
          output: "src/styles/_icons.scss",
          baseClass: "icon"
        },
        xmp: {
          enabled: true,
          creator: "Frontend Engineering",
          copyright: "Copyright © 2026",
          license: "MIT"
        }
      },
      build: {}
    }
  });

  grunt.loadNpmTasks("grunt-svg-sprite-studio");
  grunt.registerTask("default", ["svg_sprite_studio"]);
};
```

## Complete Configuration Guide

Below is an exhaustive breakdown of every configuration option available in `grunt-svg-sprite-studio`.

```javascript
options: {
    source: 'src/icons/**/*.svg',
    exclude: ['**/temp/**', '**/drafts/**'],
    debug: false
}
```

### `output` Configuration

Controls sprite destination and formatting modes.

```javascript
output: {
  directory: "dist",
  sprite: "icons.svg",
  format: "optimized"
}

```

### `symbol` Configuration

Defines symbol ID formatting rules inside the generated sprite.

```javascript
symbol: {
  prefix: "icon-",
  suffix: ""
}

```

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

### `attributes` Configuration

Global SVG attribute injections applied to every `<symbol>` element.

```javascript
attributes: {
  fill: "currentColor",
  "stroke-width": "2",
  class: "sprite-symbol"
}

```

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
