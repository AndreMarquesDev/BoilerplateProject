var gulp = require('gulp'),
    wrap = require('gulp-wrap'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    browser = require('browser-sync'),
    partials = require('gulp-inject-partials'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
    index = require('gulp-index');

// Compile SASS
gulp.task('sass', () => {
  gulp.watch(['scss/*.scss', 'scss/**/*scss', 'modules/**/scss/*.scss']).on('change', () => {
    return gulp.src('scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(autoprefixer({ gulpbrowsers: ['last 2 versions'] }))
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest('../css'))
    .pipe(browser.reload({ stream: true }));
  });
});

// Compile JS
gulp.task('js', () => {
  gulp.watch('modules/**/scripts/*.js').on('change', (file) => {
    gulp.src(file.path)
      //.pipe(uglify())
      .pipe(plumber()) // to avoid default behavior of exiting cmd line when error on script compilation
      .pipe(babel({presets: ['es2015']}))
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest('../scripts'))
      .pipe(browser.reload({ stream: true, once: true }));
  });
});

gulp.task('modules', () => {
  gulp.watch('modules/**/*.html').on('change', (file) => {
    gulp.src(file.path)
      .pipe(wrap({ src: 'moduleTemplate.html' }))
      .pipe(rename({ dirname: '' }))
      .pipe(gulp.dest('../html'))
      .pipe(browser.reload({ stream: true }));
  });
});

gulp.task('html:buildIndex', () => {
  gulp.watch('modules/**/*.html').on('change', () => {
    return gulp.src('../html/*.*')
    .pipe(index({
      // written out before index contents
      'prepend-to-output': () => `<head>
        <meta name="viewport" content="width=device-width, initial-scale=1, initial-scale = 1.0, shrink-to-fit=no">
        <link rel="stylesheet" href="../css/main.css">
      </head>
      <body>
        <style>
          li {
            display: inline-block;
            font-size: 20px;
            margin-left: 50px;
            margin-bottom: 5px;
            border-bottom: 1px solid black;
            transition: border-bottom 0.2s ease-in-out;
          }

          li:hover {
            border-bottom: 1px solid transparent;
          }

          a {
            color: black;
            text-decoration: none;
          }

        </style>`,
       // written out after index contents
      'append-to-output': () => `</body>`,
      // 'item-template': (filepath, filename) => `<li class="index__item"><a class="index__item-link" href="${filepath}${filename}">${filepath}${filename}</a></li>`,
      'item-template': (filepath) => `<li class="index__item"><a class="index__item-link" href="${filepath}">${filepath.split('html')[1]}</a></li>`,
      'section-heading-template' : (heading) => ''
    }))
    .pipe(gulp.dest('../html'))
    .pipe(browser.reload({ stream: true }));
  });
});

// gulp.task('templates', () => {
//   gulp.src('templates/*.html')
//     .pipe(partials({ removeTags: true }))
//     .pipe(wrap({ src: 'layout.html' }))
//     .pipe(rename({ dirname: '' }))
//     .pipe(gulp.dest('../html/templates'))
//     .pipe(browser.reload({ stream: true }));
// });

gulp.task('browser-sync', () => {
  browser.init(null, {
    server: {
      baseDir: '../',
    },
    startPath: 'html/index.html'
  });

});

gulp.task('watch', () => {
  gulp.watch('templates/**/*.html', ['templates']);
});

gulp.task('default', ['sass', 'js', 'modules', 'html:buildIndex', 'watch', 'browser-sync']);
//gulp.task('default', ['sass', 'js', 'modules', 'templates', 'watch', 'html:buildIndex', 'browser-sync']);