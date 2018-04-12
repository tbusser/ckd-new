const
	argv       = require('yargs').argv,
	gulp       = require('gulp'),
	gzip       = require('gulp-gzip'),
	htmlmin    = require('gulp-htmlmin'),
	size       = require('gulp-size'),
	when       = require('gulp-if'),
	paths      = require('../paths');

// 'gulp html' -- does nothing
// 'gulp html --prod' -- minifies and gzips HTML files for production
gulp.task('html', () => {
	return gulp.src(paths.siteFolderName + paths.htmlPattern)
		.pipe(when(argv.prod, htmlmin({
			removeComments: true,
			collapseWhitespace: true,
			collapseBooleanAttributes: false,
			removeAttributeQuotes: false,
			removeRedundantAttributes: false,
			minifyJS: true,
			minifyCSS: true
		})))
		.pipe(when(argv.prod, size({title: 'optimized HTML'})))
		.pipe(when(argv.prod, gulp.dest(paths.siteFolderName)))
		.pipe(when(argv.prod, gzip({append: true})))
		.pipe(when(argv.prod, size({
			title: 'gzipped HTML',
			gzip: true
		})))
		.pipe(when(argv.prod, gulp.dest(paths.siteFolderName)))
});
