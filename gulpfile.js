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

	let paths = [ './src/', './examples/' ];

	for ( let i = 0; i < paths.length; i ++ ) {

		gulp.src( paths[ i ] + '**/*.ts' )
			.pipe( eslint( { useEslintrc: true, fix: true } ) ) // .eslintrc を参照
			.pipe( eslint.format() )
			.pipe( gulpIf( isFixed, gulp.dest( paths[ i ] ) ) )
			.pipe( eslint.failAfterError() );

	}

	cb();

}

function buildWebpack( cb ){

	let conf = webpackConfig;
	conf.entry.main = './src/ts/main.ts';
	conf.output.filename = 'script.js';

	if( options.P ){

		conf.mode = 'production';

	}

	webpackStream( conf, webpack ).on( 'error', function ( e ) {
			this.emit( 'end' );
		} )
		.pipe( gulp.dest( "./public/js/" ) )
		.on( 'end', cb );
		
}

function buildSass() {
	
	return gulp.src( "./src/scss/style.scss" )
		.pipe( plumber() )
		.pipe( sass() )
		.pipe( autoprefixer([ 'last 2 versions'] ) )
		.pipe( cssmin() )
		.pipe( gulp.dest( "./public/css/" ) )
		.pipe( browserSync.stream() );
		
}

function copy( c ){
	
	gulp.src( ['./src/html/**/*'] ).pipe( gulp.dest( './public/' ) );
	gulp.src( ['./src/assets/**/*'] ).pipe( gulp.dest( './public/assets/' ) );

	c();
	
}

function brSync() {

	browserSync.init( {
		server: {
			baseDir: "public",
			index: "index.html"
		},
		ghostMode: false,
		notify: false,
		open: true
	} );

}

function clean( c ){

	del( 
		[ './public/' ],
		{
			force: true,
		} 
	).then( (paths) => {

		c();

	} );

}

function reload( cb ) {

	browserSync.reload();

	cb();
	
}

function watch(){

	gulp.watch( './src/ts/**/*', gulp.series( buildWebpack, reload ) );
	gulp.watch( './src/scss/**/*.scss', gulp.series( buildSass ) );
	gulp.watch( './src/html/**/*', gulp.series( copy, reload  ) );
	gulp.watch( './src/assets/**/*', gulp.series( copy, reload  ) );
	
}

exports.default = gulp.series( 
	clean,
	gulp.parallel( buildWebpack, buildSass ),
	copy,
	gulp.parallel( brSync, watch )
);

exports.build = gulp.series( 
	clean,
	gulp.parallel( buildWebpack, buildSass ),
	copy,
);

exports.lint = gulp.task( lint );