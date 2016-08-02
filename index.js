/**
 * Module dependencies.
 */

 var through = require('through2')
 var path = require('path')
 var assign = require('lodash.assign')
 var merge = require('lodash.merge')
 var consolidate = require('consolidate')
 var fs = require('fs')
 var marked = require('marked')

/**
 * Constants.
 */

 var RE_COMMENTS = /^\/\*{2}@docs(.|\n)*\*\/$/gm
 var RE_VARS = /\@([a-zA-Z0-9_-]+)\s+(.*)/g
 var DIR = __dirname
 var PROJECT_PATH = process.cwd()

/**
 * Defaults Settings.
 */

var defaults = {
  templatePath: path.join(DIR, 'template'),
  outputPath: 'styleguide',
  vars: {
    template: 'template.html',
    output: null,
    css: ''
  }
}

var settings = {}

var files = []

/**
 * Expose main function.
 */

module.exports = function (options) {
  merge(settings, defaults, options)

  return through.obj(function (file, enc, cb) {
    var fileObj = assign({}, settings.vars)

    var str = file.contents.toString(enc || 'utf-8')
    str = extractDocsComments(str)

    if (!str) return cb(null, file)

    fileObj.filepath = path.parse(file.path)
    fileObj.contents = marked(extractVars(str, fileObj).trim())

    if (!fileObj.output) {
      fileObj.output = fileObj.filepath.name + '.html'
    }

    files.push(fileObj)

    return cb(null, file)
  })
  .on('end', function () {
    files.forEach(render)
  })
}

/**
 * Extracts the `@docs` comments from the string.
 * @param {String} str
 */

function extractDocsComments (str) {
  var match = str.match(RE_COMMENTS)
  if (!match) return false

  match = match[0].split('\n')
  return match
    .slice(1, match.length - 1)
    .join('\n')
}

/**
 * Extracts variables `@varname value` from the string.
 * @param {String} str
 * @param {Object} fileObj
 */

function extractVars (str, fileObj) {
  return str.replace(RE_VARS, function (line, key, value) {
    fileObj[key] = value
    return ''
  })
}

/**
 * Renders a `fileObj`.
 * @param {Object} fileObj
 */

function render (fileObj) {
  fileObj.all = files
  var templateFile = path.join(settings.templatePath, fileObj.template)
  var outputFile = path.join(PROJECT_PATH, settings.outputPath, fileObj.output)

  consolidate.ejs(templateFile, fileObj, function (err, html) {
    fs.writeFile(outputFile, html, 'utf8')
  })
}
