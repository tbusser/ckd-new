const
	gulp = require('gulp'),
	size = require('gulp-size'),
	paths = require('../paths');

// 'gulp fonts' -- copies fonts to temporary assets directory
gulp.task('fonts', () => {
	return gulp.src(paths.fontFiles + '/**/*')
		.pipe(gulp.dest(paths.fontFilesTemp))
		.pipe(size({title: 'fonts'}))
});
