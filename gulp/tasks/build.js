const
	argv  = require('yargs').argv,
	gulp  = require('gulp'),
	shell = require('shelljs'),
	size  = require('gulp-size'),
	paths = require('../paths');

// 'gulp site:tmp' -- copies Jekyll site to a temporary directory to be processed
gulp.task('site:tmp', () => {
	const
		globPattern = [
			paths.sourceFolderName + '/**/*',
			'!' + paths.sourceDir + paths.assetsFolderName + '/images/*',
			'!' + paths.sourceDir + paths.assetsFolderName + '/fonts/*',
			'!' + paths.sourceDir + paths.assetsFolderName + '/javascript/*',
			'!' + paths.sourceDir + paths.assetsFolderName + '/stylesheets/**/*'
		];

	return gulp.src(globPattern, {dot: true})
		.pipe(gulp.dest(paths.tempDir + paths.sourceFolderName))
		.pipe(size({title: 'Jekyll'}))
});

// 'gulp site' -- builds site with development settings
// 'gulp site --prod' -- builds site with production settings
gulp.task('site', done => {
	if (!argv.prod) {
		shell.exec('bundle exec jekyll build --config _config.yml,_config.dev.yml');
		done();
	} else if (argv.prod) {
		// shell.exec('bundle exec jekyll algolia');
		shell.exec('bundle exec jekyll build');
		done();
	}
});

// 'gulp site:check' -- builds site with production settings then tests with html-proofer
gulp.task('site:check', done => {
	shell.exec('gulp build --prod');
	shell.exec('bundle exec rake test');
	done();
});
