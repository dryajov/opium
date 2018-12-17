'use strict'

const gulp = require('gulp')
const rimraf = require('gulp-rimraf')

// Clean
gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist/scripts'], {read: false}).pipe(rimraf())
})
