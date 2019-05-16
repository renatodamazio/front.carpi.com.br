const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminOptipng = require('imagemin-optipng');
const imageminSvgo = require('imagemin-svgo');
const imageminMozjpeg = require('imagemin-mozjpeg');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const chalk = require('chalk');
const logSymbols = require('log-symbols');
const dotenv = require('dotenv').config({ path: './config/.env' });
const webpack = require('webpack-stream');
const notify = require('gulp-notify');
const minifyejs = require('gulp-minify-ejs');
const rename = require('gulp-rename');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const inject = require('gulp-inject-string');
const cleanCSS = require('gulp-clean-css');
const fs = require('fs');

gulp.task('bundle', () => {

  const stream = gulp
    .src('./src/assets/js/app.js')
    .pipe(webpack({
      watch: true,
      devtool: process.env.NODE_ENV === "development" ? 'inline-source-map' : false,
      mode: process.env.NODE_ENV || "development",
      entry: {
        app: './src/assets/js/app.js'
      },
      output: {
        filename: 'app.js',
      },
      resolve: {
        alias: {
          'vue$': 'vue/dist/vue.esm.js'
        }
      },
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.scss$/,
            use: [
              'vue-style-loader',
              'css-loader',
              {
                loader: 'sass-loader'
              }
            ]
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      },
      plugins: [
        new VueLoaderPlugin()
      ]
    }));

  if (process.env.NODE_ENV === "production") {

    return stream
      .pipe(inject.wrap('<script async>', '</script>'))
      .pipe(rename('scripts.ejs'))
      .pipe(notify('Success! The JS was compress to .ejs file'))
      .pipe(gulp.dest('dist/views/partials'));

  } else if (process.env.NODE_ENV === "development") {

    return stream
      .pipe(gulp.dest('./dist/js'))
      .pipe(notify('Success! The scripts were compiled.'));

  }

})

/* Compile and minify styles */
gulp.task('sass', () => {

  return gulp
    .src('src/assets/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(inject.wrap('<style async>', '</style>'))
    .pipe(rename('styles.ejs'))
    .pipe(gulp.dest('dist/views/partials'))
    .pipe(notify('Success! The styles were compiled.'));

});

gulp.task('imagemin', function () {
  gulp.src('./src/assets/img/**/*')
    .pipe(imagemin([
      imageminMozjpeg({
        quality: 90
      }),

      imageminOptipng({
        optimizationLevel: 5
      }),

      imageminSvgo({
        plugins: [{
          removeViewBox: true
        },
        {
          cleanupIDs: false
        }
        ]
      })
    ]))
    .pipe(gulp.dest('./dist/img'))
});

gulp.task('browser-sync', ['nodemon'], function () {

  const PORT = process.env.PORT ? process.env.PORT : 5000;

  browserSync.init(null, {

    proxy: 'http://localhost:' + PORT,
    port: 3000,
    open: false,
    sync: false

  });

});

gulp.task('nodemon', function (cb) {

  let started = false;

  return nodemon({

    script: 'index.js',
    ext: 'vue html scss js',
    ignore: [
      ".git",
      "node_modules/**/*.*",
      "./dist/css/app.min.css"
    ],
    watch: [
      "./"
    ]

  }).on('start', function () {

    if (!started) {

      cb();

      started = true;

    }

  });

});

/* Minify HTML */
gulp.task('minify-html', function () {

  return gulp
    .src(['src/views/**/*', 'src/views/**'])
    .pipe(minifyejs())
    .pipe(gulp.dest('dist/views'))

});

gulp.task('default', ['browser-sync', 'sass', 'imagemin', 'minify-html'], function () {

  gulp.watch("src/views/**/*.*", ['minify-html']);
  gulp.watch("src/assets/scss/**/*.*", ['sass']);

  console.log(logSymbols.success, chalk.green('Success! The styles and scripts were compiled.'));

});

gulp.task('webpack', ['bundle']);
