'use strict';

var browserify = require('browserify');
var config = require('../config');
var gulp = require('gulp');
var debug = require('gulp-debug');
var rename = require('gulp-rename');
var rev = require('gulp-rev');
var source = require('vinyl-source-stream');
var babelify = require("babelify");

// Vendor
gulp.task('vendor', function () {
  return browserify({debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'));
});

// Browserify
gulp.task('browserify', function () {
  return browserify({
    debug: true,
    standalone: 'Opium'
  })
    .transform(babelify)
    .add('./app/scripts/opium.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'));
});

// Browserify
gulp.task('browserify-test', ['browserify', 'vendor'], function () {
  return browserify({debug: true})
    .require('babel-polyfill')
    .transform(babelify)
    .add(__dirname + '/../../test/specs.js')
    .bundle()
    .pipe(source('specs.js'))
    .pipe(gulp.dest(config.dist + '/test/'));
});

// Script Dist
gulp.task('scripts:dist', function () {
  return gulp.src(['./dist/scripts/*.js'], {base: 'dist'})
    .pipe(debug())
    .require('babel-polyfill')
    .transform(babelify)
    .pipe(gulp.dest('dist'))
    .pipe(rev())
    .pipe(gulp.dest('dist'))
    .pipe(rev.manifest())
    .pipe(rename('script-manifest.json'))
    .pipe(gulp.dest('dist'));
});
