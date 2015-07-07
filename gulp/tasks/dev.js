'use strict';

var gulp = require('gulp');

// Dev Server
gulp.task('dev', ['vendor', 'browserify', 'watch']);
