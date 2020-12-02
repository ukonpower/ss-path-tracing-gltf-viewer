
const gulp = require( 'gulp' );
const gulpIf = require( 'gulp-if' );
const webpackStream = require( 'webpack-stream' );
const webpack = require( 'webpack' );
const webpackConfig = require( './webpack.config.js' );
const browserSync = require( 'browser-sync' );
const autoprefixer = require( 'gulp-autoprefixer' );
const plumber = require( 'gulp-plumber' );
const sass = require( 'gulp-sass' );
const cssmin = require( 'gulp-cssmin' );
const del = require( 'del' );
const eslint = require( 'gulp-eslint' );
const minimist = require( 'minimist' );

const options = minimist( process.argv.slice( 2 ), {

	default: {
		P: false,
	}

} );

function isFixed( file ) {

	return file.eslint != null && file.eslint.fixed;

}

function lint( cb ) {

	let paths = [ './src/' ];

	for ( let i = 0; i < paths.length; i ++ ) {

		gulp.src( paths[ i ] + '**/*.ts' )
			.pipe( eslint( { useEslintrc: true, fix: true } ) ) // .eslintrc を参照
			.pipe( eslint.format() )
			.pipe( gulpIf( isFixed, gulp.dest( paths[ i ] ) ) )
			.pipe( eslint.failAfterError() );

	}

	cb();

}

function buildWebpack() {

	let conf = webpackConfig;
	conf.entry.main = './src/views/index.tsx';
	conf.output.filename = 'script.js';

	if ( options.P ) {

		conf.mode = 'production';

	}

	return webpackStream( conf, webpack ).on( 'error', function ( e ) {

		this.emit( 'end' );

	} )
		.pipe( gulp.dest( "./public/js/" ) );

}

function copy( c ) {

	gulp.src( [ './src/html/**/*' ] ).pipe( gulp.dest( './public/' ) );
	gulp.src( [ './src/assets/**/*' ] ).pipe( gulp.dest( './public/assets/' ) );

	c();

}

function brSync() {

	browserSync.init( {
		server: {
			baseDir: "public",
			index: "index.html"
		},
		open: true,
		notify: false,
		ghostMode: false,
	} );

}

function brSyncReload( cb ) {

	browserSync.reload();

	cb();

}


function clean( c ) {

	del(
		[ './public/' ],
		{
			force: true,
		}
	).then( ( paths ) => {

		c();

	} );

}

function watch() {

	gulp.watch( './src/views/**/*', gulp.series( buildWebpack, brSyncReload ) );
	gulp.watch( './src/html/**/*', gulp.series( copy, brSyncReload ) );
	gulp.watch( './src/assets/**/*', gulp.series( copy, brSyncReload ) );

}

exports.default = gulp.series(
	clean,
	gulp.parallel( buildWebpack ),
	copy,
	gulp.parallel( brSync, watch )
);

exports.lint = gulp.task( lint );
