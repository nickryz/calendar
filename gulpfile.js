'use strict';
var gulp 				= require('gulp'),
	sass 				= require('gulp-sass'),
	plumber 			= require('gulp-plumber'),
	autoprefixer 		= require('gulp-autoprefixer'),
	csso 				= require('gulp-csso'),
	rename 				= require('gulp-rename'),
	browserSync 		= require('browser-sync'),
	browserify 			= require('gulp-browserify'),
	babelify 			= require('babelify'),
	uglify 				= require('gulp-uglify'),
	concat 				= require('gulp-concat'), 
	babel 				= require("gulp-babel"),
	imagemin 			= require('gulp-imagemin'),
	polyfill 			= require('babel-polyfill');



// module.exports = {
// 	entry: ['babel-polyfill', "src/js/main.js"]
// };
// commit

gulp.task('compress', function () {
	gulp.src('dist/img/**/')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/imgNew/'))
});


gulp.task('css', function () {
	return gulp.src('src/scss/main.scss')
		.pipe(plumber())
		.pipe(sass()) 
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(csso())
		// .pipe(rename({
		// 	extname: '.css',
		// 	suffix: '.min'
		// }))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream())
});

gulp.task('js', function () {
	return gulp.src('src/js/*.js')
		.pipe(plumber())
		// .pipe(browserify({
		// 	debug: true,
		// 	transform: [babelify.configure({
		// 		presets: ['es2015']
		// 	})]
		// }))
		// .pipe(concat('main.min.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.stream());
});

gulp.task('browser-sync', ['css'], function () {

	browserSync({
		server: {
			baseDir: './dist'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync', 'css', 'js'], function () {

	gulp.watch('src/**/*.scss', ['css']);
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('dist/*.html', browserSync.reload);
});