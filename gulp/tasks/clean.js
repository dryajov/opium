'use strict';

var gulp = require('gulp');
var rimraf = require('gulp-rimraf');

// Clean
gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist/scripts'], {read: false}).pipe(rimraf());
});
