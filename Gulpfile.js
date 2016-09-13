'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    minifyCSS = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    nodemon = require('gulp-nodemon');

gulp.task('styles', function() {
  return gulp.src('assets/sass/kiku.scss')
  .pipe(sourcemaps.init())
	.pipe(sass({ style: 'compressed' }))
  .pipe(minifyCSS())
  .pipe(rename('kiku.css'))
  .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('public'))
	.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('node', function(){
  nodemon({
      script: 'bin/www'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
    })
});

gulp.task('scripts', function() {
	return gulp.src('assets/javascripts/*.js')
		.pipe(concat('kiku.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public'))
    .pipe(notify({message: 'Scripts task complete'}));
});

// Watch
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('assets/sass/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('assets/javascripts/**/*.js', ['scripts']);


});

gulp.task('default', ['styles', 'scripts', 'watch','node']);
gulp.task ('build', [ 'styles', 'scripts' ]);
