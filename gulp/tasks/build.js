'use strict'

const gulp = require('gulp')

// Build
gulp.task('build', ['vendor', 'browserify', 'transpile'])
