var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename');
var imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var browserSync = require('browser-sync').create();
var pkg = require('./package.json');


// Set the banner content
var banner = ['/*!\n',
  ' * Simaar\'s Portfolio - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2016-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' */\n',
  ''
].join('');


/*======================================
 =          browserSync          =
 ======================================*/
// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
})


/*======================================
 =               STYLES                =
 ======================================*/
// Compiles SCSS files from /scss into /css
gulp.task('sass',['minify-css'], function () {
  return gulp.src('scss/index.scss')
    .pipe(sass())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['styles'], function() {
    return gulp.src('assets/css/index.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('styles', function () {
  gulp.src([
    'assets/libs/bootstrap/css/bootstrap.min.css',
    'assets/libs/font-awesome/css/font-awesome.min.css',
    'assets/css/index.min.css'
      ])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/assets/css/'))
    .pipe(minifycss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/css/'))
    .pipe(browserSync.reload({ stream: true }))
});


/*======================================
 =               SCRIPTS                =
 ======================================*/
// Minify JS
gulp.task('minify-js', function () {
  return gulp.src('js/main.js')
    .pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


gulp.task('scripts', function () {
  return gulp.src([
    'assets/libs/jquery/jquery.min.js',
    'assets/libs/bootstrap/js/bootstrap.min.js',
    'assets/libs/jquery/jquery.easing.min.js',
    'assets/libs/jquery/jquery.smooth-scroll.js',
    'assets/js/load-img.js',
    'assets/js/main.js',
  ])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('dist/assets/scripts/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/scripts/'))
    .pipe(browserSync.reload({ stream: true }))
});


/*======================================
 =              COPY FILES             =
 ======================================*/
// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
   gulp.src(['assets/img/**'])
    .pipe(gulp.dest('dist/assets/img'));
});



/*======================================
 =               IMAGES                =
 ======================================*/
gulp.task('images', function () {
  gulp.src('assets/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'));
});


/*======================================
 =               BUILD                =
 ======================================*/
// Dev task with browserSync
gulp.task('serve', ['browserSync'], function () {
  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('assets/css/*.css', ['minify-css']);
  gulp.watch('js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
});

/*======================================
 =               DEFAULT                =
 ======================================*/
// Run everything
gulp.task('default', ['sass', 'minify-js']);

