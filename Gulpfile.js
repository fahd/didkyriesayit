const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require("gulp-babel");

 
// Functions becasue gulp is stupid now
function minifyCss(){
  return gulp
    .src('public/styles/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
}

function js() {
  return gulp.src(['public/client/main.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist'));
}

function watch(){
  gulp.watch('public/styles/*.css', minifyCss);
  gulp.watch('client/*.js', js);
}

// Tasks
gulp.task('minify-css', minifyCss);
gulp.task('js', js);
gulp.task('watch', watch);

// Default Task
gulp.task('default', gulp.series(minifyCss,js));
gulp.task('watch', gulp.series(minifyCss,js,watch));