require("babel-polyfill");
const gulp = require('gulp'),
    sass = require('gulp-sass'),
    neat = require('node-neat').includePaths;
    cleanCSS = require('gulp-clean-css');
    uglify = require('gulp-uglify'),
    concatify = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    minifyhtml = require('gulp-minify-html');
    nodeSassGlobbing = require('node-sass-globbing'),
    livereload = require('gulp-livereload');
    babel = require('gulp-babel');
// Paths to various files
var paths = {
    scripts: ['js/*'],
    styles: ['scss/main.scss','scss/**/*.scss', 'scss/*.scss'],
    images: ['images/**/*'],
}

// Compiles scss files and outputs minified file to public/css/*.css
gulp.task('styles', function() {
    return gulp.src(paths.styles)
      .pipe(sass({
          importer: nodeSassGlobbing,
          includePaths: ['styles'].concat(neat)
      }))
      .pipe(cleanCSS({debug: true}, function(details) {
          console.log(details.name + ': ' + details.stats.originalSize);
          console.log(details.name + ': ' + details.stats.minifiedSize);
      }))
      .pipe(gulp.dest('./public/css/'))
      .pipe(livereload());
});


// Concats & minifies js files and outputs them to public/js/app.js
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(babel({
           presets: ['env', 'es2015', 'stage-2']
        }))
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concatify('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe(livereload());
});

// Optimizes our image files and outputs them to public/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
                .pipe(imagemin({
                    optimizationLevel: 5
                }))
                .pipe(gulp.dest('./public/images'))
                .pipe(livereload());
})

// Watches for changes to our files and executes required scripts
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch']);
