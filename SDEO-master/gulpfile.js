var gulp = require('gulp')
var sass = require('gulp-sass')
var pug = require('gulp-pug')
var rename = require("gulp-rename");
var concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const cleanCSS = require('gulp-clean-css')
//const terser = require('gulp-terser-js')
var uglify = require('gulp-uglify')

sass.compiler = require('node-sass')

/*const minifyJS = () =>
  gulp.src('src/js/*.js')
    .pipe(terser({
      mangle: {
        toplevel: true
      }
    }))
    .on('error', function (error) {
      this.emit('end')
    })
    .pipe(gulp.dest('dist/js/'))
*/
gulp.task('sass', () => {
  return gulp.src('src/views/styles/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/views/styles/css'))
});

gulp.task('minify-css', () => {
  return gulp.src('src/views/styles/css/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/css'))
});

gulp.task('pug', () => {
  return gulp.src('src/views/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('dist'))
});

gulp.task('concat', () => {
  return gulp.src('src/views/scripts/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/views/scripts'))
});

gulp.task('imagemin', () => {
  gulp.src('src/views/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});

gulp.task('uglify', () => {
  return gulp.src('src/views/scripts/main.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist/js'))
});

//gulp.task('minifyJS', minifyJS)

//
gulp.task('run', gulp.series('sass', 'minify-css', 'pug', 'concat', 'uglify'))

gulp.task('watch', () => {
  gulp.watch('src/views/styles/sass/*.scss', gulp.series('sass'))
  gulp.watch('src/views/styles/css/*.css', gulp.series('minify-css'))
  gulp.watch('src/views/**/*.pug', gulp.series('pug'))
  gulp.watch('src/views/scripts/js/*.js', gulp.series('concat'))
  //gulp.watch('src/js/*.js', gulp.series('minifyJS'))
  gulp.watch('src/views/scripts/main.js', gulp.series('uglify'))
});

gulp.task('default', gulp.series('run', 'watch'))