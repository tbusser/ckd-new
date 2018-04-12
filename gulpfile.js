const
	gulp = require('gulp'),
	requireDir = require('require-dir'),
	tasks = requireDir('./gulp/tasks', {recurse: true}),
	paths = require('./gulp/paths');

// 'gulp build:site' -- copies, replaces rev'd references, builds, and then copies it again
gulp.task('build:site', gulp.series('site:tmp', 'site', 'copy:site'));

// 'gulp assets' -- removes assets and rebuilds them
// 'gulp assets --prod' -- same as above but with production settings
gulp.task('assets', gulp.series(
	gulp.series('scripts', 'styles', 'fonts', 'icons'),
	gulp.series('scripts:gzip', 'styles:gzip', 'copy:assets', 'copy:icons', 'copy:images', 'copy:manifest')
));

// 'gulp clean' -- removes assets and gzipped files
gulp.task('clean', gulp.parallel('clean:assets', 'clean:gzip', 'clean:dist', 'clean:site', 'clean:fonts'));

// 'gulp build' -- same as 'gulp' but doesn't serve site
// 'gulp build --prod' -- same as above but with production settings
gulp.task('build', gulp.series('clean', 'assets', 'build:site', 'html'));

// 'gulp critical' -- builds critical path CSS includes
//   WARNING: run this after substantial CSS changes
//   WARNING: .html files referenced need to exist, run after `gulp build` to ensure.
// gulp.task('critical', gulp.series('styles:critical:home', 'styles:critical:archive', 'styles:critical:post'));

// 'gulp deploy' -- deploy site to production and submit sitemap XML
// gulp.task('deploy', gulp.series('upload', 'submit:sitemap'));

// 'gulp rebuild' -- WARNING: removes all assets, images, and built site
gulp.task('rebuild', gulp.series('clean', 'clean:images'));

// 'gulp check' -- checks your Jekyll site for errors
gulp.task('check', gulp.series('site:check'));

// 'gulp' -- removes assets and gzipped files, creates assets and revs version
//   in includes or layouts, builds site, serves site
// 'gulp --prod' -- same as above but with production settings
gulp.task('default', gulp.series('build', 'serve'));
