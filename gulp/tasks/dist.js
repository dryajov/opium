'use strict'

const gulp = require('gulp')
const rev = require('gulp-rev')

// Build
gulp.task('dist', ['vendor', 'browserify'], function () {
  return gulp.src(['.tmp/scripts/*.js'], {base: '.tmp'})
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist'))
})
