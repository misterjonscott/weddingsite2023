'use strict';

import gulp from 'gulp';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import dartSass from 'gulp-dart-sass';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

// Cache busting task
gulp.task('cache-bust', function () {
    return gulp.src('css/styles.min.css')
        .pipe(rev())  // Append version to filename
        .pipe(gulp.dest('dist/css')) // Output hashed files to the 'dist/css' folder
        .pipe(rev.manifest())
        .pipe(gulp.dest('dist'));
});

// Update references in HTML
gulp.task('update-references', function () {
    var manifest = gulp.src('dist/rev-manifest.json');

    return gulp.src('index.html')
        .pipe(revReplace({ manifest: manifest })) // Update references in HTML
        .pipe(gulp.dest('dist'));
});

// Compile SCSS to CSS
gulp.task('sass', function () {
    return gulp.src('./sass/styles.scss')
        .pipe(dartSass.sync({ outputStyle: 'compressed' }).on('error', dartSass.logError))
        .pipe(rename({ basename: 'styles.min' }))
        .pipe(gulp.dest('./css'));
});

// Minify JS
gulp.task('minify-js', function () {
    return gulp.src('./js/scripts.js')
        .pipe(uglify())
        .pipe(rename({ basename: 'scripts.min' }))
        .pipe(gulp.dest('./js'));
});

// Watch changes in SCSS files and run tasks
gulp.task('sasswatch', function () {
    gulp.watch('./sass/**/*.scss', gulp.series('sass', 'cache-bust', 'update-references'));
});

// Default task
gulp.task('default', gulp.series('sass', 'minify-js', 'cache-bust', 'update-references'));
