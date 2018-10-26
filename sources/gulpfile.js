var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    browser = require('browser-sync'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    index = require('gulp-index'),
    obfuscator = require('gulp-javascript-obfuscator'),
    partials = require('gulp-inject-partials'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    wrap = require('gulp-wrap');

// Compile SASS
gulp.task('sass', () => {
  return gulp.src('scss/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(cssnano())
  .pipe(autoprefixer({ gulpbrowsers: ['last 2 versions'] }))
  .pipe(gulp.dest('../css'));
});

// Compile JS
gulp.task('js', () => {
  return gulp.src(['main.js', 'modules/**/*.js'])
    .pipe(plumber()) // to avoid default behavior of exiting cmd line when error on script compilation
    .pipe(babel({presets: ['es2015']}))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('../scripts/core'));
});

// Compile HTML
gulp.task('modules', () => {
  gulp.src('modules/**/*.html')
    .pipe(wrap({ src: 'moduleTemplate.html' }))
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('../html'));
});

// // Build Template
// gulp.task('buildTemplate', () => {
//   gulp.src('indexTemplate.html')
//     .pipe(partials({removeTags: true}))
//     .pipe(rename('index.html'))
//     .pipe(gulp.dest('../'))
// });

// Build Modules Index
gulp.task('html:buildIndex', () => {
  return gulp.src('../html/*.*')
  .pipe(index({
    // written out before index contents
    'prepend-to-output': () => `
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, initial-scale = 1.0, shrink-to-fit=no">
        <link rel="stylesheet" href="../css/main.css">
      </head>
      <body>
        <style>
          li {
            display: inline-block;
            margin-left: 10px;
            margin-top: 10px;
            border-bottom: 1px solid black;
            transition: border-bottom 0.2s ease-in-out;
          }

          li:hover {
            border-bottom: 1px solid transparent;
          }

          a {
            text-decoration: none;
          }

        </style>`,
    // written out after index contents
    'append-to-output': () => `</body>`,
    // Title for the index page
    'title': 'Modules Index',
    // Section heading function used to construct each section heading
    'section-heading-template': () => '',
    // Item function used to construct each list item
    'item-template': (filepath) => `<li class="index__item"><a class="index__item-link" href="${filepath}">${filepath.split('html')[1].split('.')[0].split('\\')[1]}</a></li>`
  }))
  .pipe(gulp.dest('../html'))
});

// Browser Sync
gulp.task('browser-sync', () => {
  browser.init(null, {
    server: {
      baseDir: "../"
    },
    startPath: 'html/index.html'
  });
  gulp.watch(['scss/*.scss', 'scss/**/*scss', 'modules/**/*.scss'], ['sass', browser.reload]);
  gulp.watch(['main.js', 'modules/**/*.js'], ['js', browser.reload]);
  gulp.watch('modules/**/*.html', ['modules', 'html:buildIndex', browser.reload]);
});

gulp.task('default', ['sass', 'js', 'modules', 'html:buildIndex', 'browser-sync']);

// Build tasks

// Concat scripts
gulp.task('concat', () => {
  gulp.src('../scripts/core/*.js')
    .pipe(concat('script.js'))
    .pipe(obfuscator())
    .pipe(gulp.dest('../scripts'));
});

// Uglify scripts
gulp.task('uglify', () => {
  return gulp.src('../scripts/script.js')
    .pipe(obfuscator())
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('../scripts'));
});

gulp.task('build', ['concat', 'uglify']);