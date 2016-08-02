# gulp-styleguide-generator

A small gulp plugin for generating styleguides.

:white_check_mark: CSS or any preprocessors.

:white_check_mark: EJS as template engine

:white_check_mark: Simple and small

:white_check_mark: Include custom variables

:white_check_mark: Markdown

## Installation

`npm install gulp-styleguide-generator --save-dev`

## Usage

In your gulpfile.js:

```js
var gulp = require('gulp')
var styleguide = require('gulp-styleguide-generator')

gulp.task('styleguide', function () {
  return gulp.src('source/**/*.css')
    .pipe(styleguide({}))
})
```

## Options

```js
var defaults = {
  templatePath: path.join(DIR, 'template'),
  outputPath: 'styleguide',
  vars: {
    template: 'template.html',
    output: null,
    css: ''
  }
}
```

## Comments style

Your comment should start with `/**@docs`. Here's an example:

```css
/**@docs

  You can override default variables:
  @template my-other-template-file.html

  Or just create new variables:
  @my-new-variable variable-value

  You can freely use markdown:

  ## My Component Name

  Description of my **component** here.

*/
```
