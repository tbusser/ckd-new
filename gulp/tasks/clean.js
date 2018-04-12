const
	del   = require('del'),
	gulp  = require('gulp'),
	paths = require('../paths');

// 'gulp clean:assets' -- removes temporary and built CSS/JS assets
gulp.task('clean:assets', () => {
	const
		globPattern = [
			paths.tempFolderName + '/**/*',
			'!' + paths.assetFilesTemp,
			paths.assetFilesSite + '/**/*',
			'!' + paths.imageFilesSite,
			'!' + paths.imageFilesSite + '/**/*',
			paths.fontFilesSite + '/**/*'
		];

	return del(globPattern);
});

// 'gulp clean:images' -- removes only image assets
gulp.task('clean:images', () => {
	return del([paths.imageFilesSite]);
});

// 'gulp clean:dist' -- removes built site but keep images
gulp.task('clean:dist', () => {
	const
		globPattern = [
			paths.siteFolderName + '/**/*',
			'!' + paths.assetFilesSite,
			'!' + paths.imageFilesSite,
			'!' + paths.imageFilesSite + '/**/*'
		];

	return del(globPattern, {dot: true});
});

// 'gulp clean:gzip' -- removes gzip files
gulp.task('clean:gzip', () => {
	return del([paths.siteFolderName + '/**/*.gz']);
});

gulp.task('clean:fonts', () => {
	return del([paths.fontFilesSite + '/**/*']);
});

// 'gulp clean:site' -- removes temporary source
gulp.task('clean:site', () => {
	return del([paths.tempDir + paths.sourceFolderName]);
});
