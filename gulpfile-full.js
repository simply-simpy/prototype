var gulp = require('gulp');
var postcss = require('gulp-postcss');
var path = require('path');
var sass = require('gulp-sass');
var jsonSass = require('gulp-json-sass');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var del = require('del');
var data = require('gulp-data');
var nunjucksRender = require('gulp-nunjucks-render');
var runSequence = require('run-sequence');
const babel = require('gulp-babel');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')();

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('clean:dist', function () {
    return del.sync(['dist', 'public']);
});

gulp.task('sass', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('main.css'))
        .pipe(autoprefixer(['last 3 versions']))
        .pipe(postcss([require('postcss-round-subpixels')]))
        .pipe(gulp.dest('dist/css'))
        .pipe(gulp.dest('public/css'));
});

gulp.task('nunjucks', function () {
    // Gets .html and .nunjucks files in pages
    return gulp.src('src/templates/pages/**/*.+(html|nunjucks)')
        .pipe(data(function() {
            // return require ('./src/js/variables/mq.json');
        }))
        .pipe(data(function() {
            //return require('./src/data/data.json');
        }))
        // Renders template with nunjucks
        .pipe(nunjucksRender({
            path: ['src/templates']
        }))
        // output files in app folder
        .pipe(gulp.dest('dist'));
});

gulp.task('copyImg', function () {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('dist/img'))
        .pipe(gulp.dest('public/img'));
});

gulp.task('copyCssImg', function () {
    return gulp.src('./src/scss/img/**/*')
        .pipe(gulp.dest('dist/css/img'))
        .pipe(gulp.dest('public/css/img'));
});

gulp.task('jsonSass', function () {
    return gulp
        .src('src/js/variables/mq.json')
        .pipe(jsonSass({}))
        .pipe(rename('_variables-mq.scss'))
        .pipe(gulp.dest('./src/scss/'));
});

// not part of watch, requires manual call to task --Probably should add this to watch
gulp.task('copyJs', function () {
    return gulp.src([
            './node_modules/bootstrap/dist/js/bootstrap.js',
            './node_modules/jquery/dist/jquery.js',
            './node_modules/mobile-detect/mobile-detect.js',
            './node_modules/picturefill/dist/picturefill.js',
            './node_modules/jquery-validation/dist/jquery.validate.js',
            './node_modules/tether/dist/js/tether.js'
        ]
    )
        .pipe(gulp.dest('./src/js/vendor'));
});

gulp.task('copyFonts', function () {
    return gulp.src('./bower_components/components-font-awesome/fonts/**')
        .pipe(gulp.dest('./src/fonts'));
});

gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('fontsCss', function () {
    return gulp.src('./src/scss/fonts/**/*.*')
        .pipe(gulp.dest('dist/css/fonts'))
        .pipe(gulp.dest('public/css/fonts'));
});

gulp.task('jsBabel', function () {
    return gulp.src('./src/js/main.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('jsVendor', function() {
    return gulp.src('./src/js/vendor/**/*.*')
        .pipe(gulp.dest('dist/js/vendor'))
        .pipe(gulp.dest('public/js/vendor'))
    //.pipe(connect.reload());
});


// Sitecore tasks
gulp.task('copyAssets', function () {
    return gulp.src(["dist/css/**/*.*", "dist/js/**/*.*", "dist/img/**/*.*"])
        .pipe(gulp.dest(["css/**/*.*", "js/**/*.*", "img/**/*.*"]))
});

// ---------------------------------------------------------------------
// | Watch tasks                                                      |
// ---------------------------------------------------------------------

gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', ['sass']);
    gulp.watch('./src/templates-nunjucks/**/*.html', ['nunjucks']);
    gulp.watch('./src/pages/**/*.html', ['nunjucks']);
    gulp.watch('./src/js/**/*.js', ['jsBabel']);
    gulp.watch('./src/js/vendor/**/*.js', ['jsVendor']);
    gulp.watch('./src/img/**/*', ['copyImg']);
    gulp.watch('./src/scss/img/**/*', ['copyCssImg']);
    gulp.watch('./src/fonts/**/*', ['fonts']);
    gulp.watch('./src/fontsCss/**/*', ['fontsCss']);
});

gulp.task('default', function (callback) { // handles assets and page reloads
    runSequence('clean:dist',
        ['copyJs', 'watch', 'jsonSass', 'sass', 'nunjucks', 'jsVendor', 'jsBabel', 'fonts', 'fontsCss', 'copyImg', 'copyCssImg'],
        callback
    )
});

gulp.task('build', function (callback) { // builds static files
    runSequence('clean:dist',
        ['jsonSass', 'copyJs', 'sass', 'nunjucks', 'jsVendor', 'jsBabel', 'fonts', 'fontsCss', 'copyImg', 'copyCssImg'],
        callback
    )
});

gulp.task('sitecoreWatch', function (callback) {
    runSequence('clean:dist',
        ['copyJs', 'watch', 'jsonSass', 'sass', 'nunjucks', 'jsVendor', 'jsBabel', 'fonts', 'fontsCss', 'copyImg', 'copyCssImg'],
        callback
    )
});

gulp.task('sitecoreBuildAssets', function (callback) { // Only builds CSS/JSS/IMG/Fonts
    runSequence('clean:dist',
        ['copyJs', 'watch', 'jsonSass',  'sass', 'babelJs', 'fonts', 'fontsCss', 'copyImg', 'copyCssImg'],
        callback
    )
});
