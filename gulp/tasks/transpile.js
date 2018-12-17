/**
 * Created by dmitriy.ryajov on 8/12/15.
 */

const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')

gulp.task('transpile', function () {
  return gulp.src('app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'))
})
