/*eslint-env node*/
var port = 8080,
    databasePrefix = '';

// Gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    sourcemaps = require('gulp-sourcemaps'),
    to5 = require('gulp-6to5'),
    less = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    clean = require('gulp-clean'),
    eslint = require('gulp-eslint'),
    shell = require('gulp-shell'),

    fs = require('fs-extra'),
    runSequence = require('run-sequence'),
    path = require('path');

// Path definition
var project = path.dirname(__filename).split(path.sep).pop() || 'klaus',
    buildPath = path.resolve('./wp-content'),
    sourcePath = 'src';

/**
 * Livereload server on buildPath
 */
gulp.task('connect', function () {
    connect.server({
        livereload: true,
        root: buildPath,
        port: port + 1
    });
});

/**
 * File watch and trigger build of:
 *      * HTML
 *      * JavaScript
 *      * LESS
 */
gulp.task('watch', function () {
    gulp.watch([sourcePath + '/**/*.html'], ['html']);
    gulp.watch([sourcePath + '/**/*.js'], ['scripts', 'lint']);
    gulp.watch([sourcePath + '/**/*.less'], ['styles']);
    gulp.watch([sourcePath + '/**/*.php'], ['php']);
});

/**
 * Purify buildPath and create build folder
 */
gulp.task('clean', function () {
    return gulp.src(buildPath, {read: false})
        .pipe(clean())
        .on('end', function () {
            fs.mkdirsSync(buildPath);
        });
});

/**
 * Clean all HTML files in buildPath
 */
gulp.task('clean-html', function () {
    return gulp.src(buildPath + '/**/*.html')
        .pipe(clean());
});

/**
 * HTML build task:
 *      * Copies HTML files to buildPath
 */
gulp.task('html', ['clean-html'], function () {
    return gulp.src(sourcePath + '/**/*.html')
        .pipe(gulp.dest(buildPath))
        .pipe(connect.reload());
});

/**
 * Clean all PHP files in buildPath
 */
gulp.task('clean-php', function () {
    return gulp.src(buildPath + '/**/*.php')
        .pipe(clean());
});

/**
 * HTML build task:
 *      * Copies HTML files to buildPath
 */
gulp.task('php', ['clean-php'], function () {
    return gulp.src(sourcePath + '/**/*.php')
        .pipe(gulp.dest(buildPath))
        .pipe(connect.reload());
});

/**
 * Clean all JavaScript files in buildPath
 */
gulp.task('clean-scripts', function () {
    return gulp.src(buildPath + '/**/*.js')
        .pipe(clean());
});

/**
 * JavaScript build task:
 *      * Converts ecmascript 6 to 5
 *      * Creates sourcemaps
 *      * Copies compiled files to buildPath
 */
gulp.task('scripts', ['clean-scripts'], function () {
    return gulp.src(sourcePath + '/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(to5())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(buildPath))
        .pipe(connect.reload());
});

/**
 * Clean all Less files in buildPath
 */
gulp.task('clean-styles', function () {
    return gulp.src(buildPath + '/**/*.less')
        .pipe(clean());
});

/**
 * LESS build task:
 *      * Converts LESS to CSS
 *      * Minifies CSS
 *      * Copies compiled files to buildPath
 */
gulp.task('styles', ['clean-styles'], function () {
    return gulp.src(sourcePath + '/**/*.less')
        .pipe(less())
        .pipe(minifyCss())
        .pipe(gulp.dest(buildPath))
        .pipe(connect.reload());
});

/**
 * Vendor build task:
 *      * Copies vendor files to buildPath
 */
gulp.task('vendor', function () {

});

/**
 * Linting task
 */
gulp.task('lint', function () {
    return gulp.src([sourcePath + '/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
});

/**
 * Dev Environment
 */
gulp.task('docker:init', shell.task([
    'docker run --name ' + project + '-mysql ' +
        '-e MYSQL_ROOT_PASSWORD=' + project + ' ' +
        '-e MYSQL_DATABASE=' + project + '-wordpress ' +
        '-v ' + path.resolve('.', 'database') + ':/var/lib/mysql' +
        '-P ' +
        '-d mysql:latest',

    'docker run --name ' + project + '-wordpress ' +
        '-e WORDPRESS_DB_PASSWORD=' + project + ' ' +
        '-e WORDPRESS_DB_NAME=' + project + '-wordpress ' +
        '-e WORDPRESS_TABLE_PREFIX=' + databasePrefix + ' ' +
        '--link ' + project + '-mysql:mysql ' +
        '-v ' + buildPath + ':/var/www/html/wp-content ' +
        '-p ' + port + ':80 ' +
        '-d wordpress:latest',

    'sleep 20',

    'docker exec -i ' + project + '-mysql ' +
       'mysql -uroot -p' + project + ' ' + project + '-wordpress < ' + path.resolve('.', 'persist.sql')
], {ignoreErrors: false, quiet: false}));

gulp.task('docker:stop', shell.task([
    'docker stop ' + project + '-wordpress',
    'docker stop ' + project + '-mysql'
], {ignoreErrors: true, quiet: true}));

gulp.task('docker:start', shell.task([
    'docker start ' + project + '-wordpress',
    'docker start ' + project + '-mysql'
], {ignoreErrors: true, quiet: true}));

gulp.task('docker:remove', ['docker:stop'], shell.task([
    'docker rm ' + project + '-wordpress',
    'docker rm ' + project + '-mysql'
], {ignoreErrors: true, quiet: true}));


gulp.task('docker', function (cb) {
    runSequence('docker:start', function () {
        gutil.log(gutil.colors.green('wordpress listening on http://docker:' + port));
        cb();
    });
});

/**
 * Persisting
 */
gulp.task('database:save', shell.task([
    'docker exec -i ' + project + '-mysql mysqldump -u root -p' + project + ' ' + project + '-wordpress > ' + path.resolve('.', 'persist.sql') + ' &'
], {ignoreErrors: true, quiet: true}));

/**
 * Build task including:
 *      * clean
 *      * html
 *      * php
 *      * scripts
 *      * styles
 */
gulp.task('build', function (cb) {
    runSequence('clean', ['html', 'php', 'lint', 'scripts', 'styles'], cb);
});

/**
 * Default task including:
 *      * build
 *      * connect
 *      * watch
 */
gulp.task('default', ['build', 'docker', 'watch']);
