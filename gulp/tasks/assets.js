const
	argv = require('yargs').argv,
	autoprefixer = require('autoprefixer'),
	browserSync = require('browser-sync').create(),
	cheerio = require('gulp-cheerio'),
	concat = require('gulp-concat'),
	cssnano = require('gulp-cssnano'),
	gulp = require('gulp'),
	gzip = require('gulp-gzip'),
	newer = require('gulp-newer'),
	postcss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	rev = require('gulp-rev'),
	sass = require('gulp-sass'),
	size = require('gulp-size'),
	sourcemaps = require('gulp-sourcemaps'),
	svgmin = require('gulp-svgmin'),
	svgstore = require('gulp-svgstore'),
	uglify = require('gulp-uglify'),
	when = require('gulp-if'),
	// include paths file
	paths = require('../paths');

// 'gulp scripts' -- creates a index.js file with Sourcemap from your JavaScript files
// 'gulp scripts --prod' -- creates a index.js file from your JavaScript files,
//   minifies, and cache busts it (does not create a Sourcemap)
gulp.task('scripts', () => {
	// NOTE: The order here is important since it's concatenated in order from
	// top to bottom, so you want vendor scripts etc on top
	return gulp.src([
		paths.jsFiles + '/main.js'
	])
		.pipe(newer(paths.jsFilesTemp + '/index.js', {
			dest: paths.jsFilesTemp,
			ext: '.js'
		}))
		.pipe(when(!argv.prod, sourcemaps.init()))
		// concatenate scripts
		.pipe(concat('index.js'))
		.pipe(size({
			showFiles: true
		}))
		// minify for production
		.pipe(when(argv.prod, when('*.js', uglify({
			preserveComments: 'some'
		}))))
		// output sourcemap for development
		.pipe(when(!argv.prod, sourcemaps.write('.')))
		.pipe(gulp.dest(paths.jsFilesTemp))
		// hash JS for production
		.pipe(when(argv.prod, rev()))
		.pipe(when(argv.prod, size({
			showFiles: true
		})))
		// output hashed files
		.pipe(when(argv.prod, gulp.dest(paths.jsFilesTemp)))
		// generate manifest of hashed CSS files
		.pipe(rev.manifest('js-manifest.json'))
		.pipe(gulp.dest(paths.tempDir + paths.sourceDir + paths.dataFolderName))
		.pipe(when(argv.prod, size({
			showFiles: true
		})))
});

// 'gulp scripts:gzip --prod' -- gzips JS
gulp.task('scripts:gzip', () => {
	return gulp.src([paths.jsFilesTemp + '/*.js'])
		.pipe(when(argv.prod, when('*.js', gzip({
			append: true
		}))))
		.pipe(when(argv.prod, size({
			gzip: true,
			showFiles: true
		})))
		.pipe(when(argv.prod, gulp.dest(paths.jsFilesTemp)))
});

// 'gulp styles' -- creates a CSS file from SCSS, adds prefixes and creates a Sourcemap
// 'gulp styles --prod' -- creates a CSS file from your SCSS, adds prefixes,
//   minifies, and cache busts it (does not create a Sourcemap)
gulp.task('styles', () => {
	return gulp.src([paths.sassFiles + '/main.scss'])
		.pipe(when(!argv.prod, sourcemaps.init()))
		// preprocess Sass
		.pipe(sass({
			precision: 10
		}).on('error', sass.logError))
		// add-remove vendor prefixes
		.pipe(postcss([autoprefixer({
			grid: true
		})]))
		// minify for production
		.pipe(when(argv.prod, when('*.css', cssnano({
			autoprefixer: false
		}))))
		.pipe(size({
			showFiles: true
		}))
		// output sourcemap for development
		.pipe(when(!argv.prod, sourcemaps.write('.')))
		.pipe(when(argv.prod, gulp.dest(paths.sassFilesTemp)))
		// hash CSS for production
		.pipe(when(argv.prod, rev()))
		.pipe(when(argv.prod, size({
			showFiles: true
		})))
		// output hashed files
		.pipe(gulp.dest(paths.sassFilesTemp))
		// generate manifest of hashed CSS files
		.pipe(rev.manifest('css-manifest.json'))
		.pipe(gulp.dest(paths.tempDir + paths.sourceDir + paths.dataFolderName))
		.pipe(when(argv.prod, size({
			showFiles: true
		})))
		.pipe(when(!argv.prod, browserSync.stream()))
});

// 'gulp styles:gzip --prod' -- gzips CSS
gulp.task('styles:gzip', () => {
	return gulp.src([paths.sassFilesTemp + '/*.css'])
		.pipe(when(argv.prod, when('*.css', gzip({
			append: true
		}))))
		.pipe(when(argv.prod, size({
			gzip: true,
			showFiles: true
		})))
		.pipe(when(argv.prod, gulp.dest(paths.sassFilesTemp)))
});

// 'gulp icons' -- combine all svg icons into single file
gulp.task('icons', () => {
	return gulp.src(paths.iconFiles + '/*.svg')
		.pipe(svgmin())
		.pipe(rename({
			prefix: 'icon-'
		}))
		.pipe(svgstore({
			fileName: 'icons.svg',
			inlineSvg: true
		}))
		.pipe(cheerio({
			run: function run($, file) {
				$('svg').attr('style', 'display:none');
				$('[fill]').removeAttr('fill');
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		.pipe(size({
			showFiles: true
		}))
		.pipe(gulp.dest(paths.iconFilesTemp))
});

// function to properly reload your browser
/**
 *
 * @param {*} done
 */
function reload(done) {
	browserSync.reload();
	done();
}

// 'gulp serve' -- open site in browser and watch for changes
// in source files and update them when needed
gulp.task('serve', (done) => {
	browserSync.init({
		// tunnel: true,
		// open: false,
		port: 4000, // change port to match default Jekyll
		ui: {
			port: 4001
		},
		server: [paths.tempFolderName, paths.siteFolderName]
	});
	done();

	// watch various files for changes and do the needful
	gulp.watch([paths.mdFilesGlob, paths.htmlFilesGlob, paths.ymlFilesGlob], gulp.series('build:site', reload));
	gulp.watch([paths.xmlFilesGlob, paths.txtFilesGlob], gulp.series('site', reload));
	gulp.watch(paths.jsFilesGlob, gulp.series('scripts', reload));
	gulp.watch(paths.sassFilesGlob, gulp.series('styles', reload));
	// gulp.watch(paths.imageFilesGlob, gulp.series('copy:images', 'images:lazyload', 'images:feature', reload));
	gulp.watch(paths.imageFilesGlob, gulp.series('copy:images', reload));
});
