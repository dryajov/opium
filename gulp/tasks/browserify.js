'use strict'

const browserify = require('browserify')
const config = require('../config')
const gulp = require('gulp')
const debug = require('gulp-debug')
const rename = require('gulp-rename')
const rev = require('gulp-rev')
const source = require('vinyl-source-stream')
const babelify = require('babelify')
const glob = require('glob')
const path = require('path')

// Vendor
gulp.task('vendor', function () {
  return browserify({debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('vendor.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'))
})

// Browserify
gulp.task('browserify', function () {
  return browserify({
    debug: true,
    standalone: 'Opium'
  })
    .transform(babelify)
    .add('./src/opium.js')
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest(config.dist + '/scripts/'))
})

// Browserify
gulp.task('browserify-test', ['browserify', 'vendor'], function () {
  const files = glob.sync(path.join(__dirname, '/../../test/**/*.spec.js'))
  console.dir(files)
  return browserify({ debug: true })
    .require('babel-polyfill')
    .transform(babelify)
    .add(files)
    .bundle()
    .pipe(source('specs.js'))
    .pipe(gulp.dest(config.dist + '/test/'))
})

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
    .pipe(gulp.dest('dist'))
})
