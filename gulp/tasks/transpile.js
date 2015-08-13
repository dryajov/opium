/**
 * Created by dmitriy.ryajov on 8/12/15.
 */

var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("transpile", function () {
    gulp.src(['node_modules/babel/**/*'])
        .pipe(gulp.dest("opium-es5/node_modules"));

    return gulp.src("app/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("opium-es5"));

});
