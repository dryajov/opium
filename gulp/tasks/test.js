const gulp = require('gulp')
const karma = require('karma').server
const path = require('path')
const jasmine = require('gulp-jasmine')

const config = require('../config')

gulp.task('test-cli', ['clean', 'browserify-test'], function () {
  return gulp.src(path.join(config.dist, '/test/', 'specs.js'))
    .pipe(jasmine())
})

/**
 * Run test once and exit
 */
gulp.task('test-browser', ['clean', 'browserify-test'], function (done) {
  karma.start({
    configFile: path.join(__dirname, '/../../test/karma.conf.js')
  }, done)
})

gulp.task('test', ['test-cli', 'test-browser'])
