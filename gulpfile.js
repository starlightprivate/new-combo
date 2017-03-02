/* jshint node: true */

"use strict";

const
  path = require('path'),
  _ = require("lodash"),
  gulp = require("gulp"),
  sass = require("gulp-sass"),
  cleanCSS = require("gulp-clean-css"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  browserify = require('gulp-browserify'),
  del = require("del"),
  concat = require("gulp-concat"),
  cache = require("gulp-cache"),
  size = require("gulp-size"),
  plumber = require("gulp-plumber"),
  purify = require("gulp-purifycss"),
  newer = require("gulp-newer"),
  connect = require("gulp-connect"),
  glob = require("glob"),
  runSequence = require("run-sequence"),
  addsrc = require("gulp-add-src"),
  XSSLint = require("xsslint"),
  CSSfilter = require("cssfilter"),
  validator = require('validator'),
  stripCssComments = require("gulp-strip-css-comments"),
  safe = require('safe-regex');

const config = {
  src: "src", // source directory
  dist: "public", // destination directory
};

// var aaa = validator.blacklist('(x+x+)+y^~', '\\+)(^~[\\]');
// console.log(aaa);

// Stylish reporter for JSHint
gulp.task('jshint', function () {
  gulp.src([
    "src/scripts/app/pages/*.js",
    "src/scripts/app/config.js",
    "src/scripts/app/utils.js",
    "src/scripts/vendor/addclear.js"
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

// Fonts
gulp.task("fonts", function () {
  return gulp.src(_.flatten([config.src + "/fonts/**/*"]))
    .pipe(newer(config.dist + "/assets/fonts"))
    .pipe(gulp.dest(config.dist + "/assets/fonts"));
});

// Images
gulp.task("images", function () {
  return gulp.src(["src/images/**/*"])
    .pipe(gulp.dest(config.dist + "/assets/images"))
    .pipe(size());
});

// HTML
gulp.task("html", function () {
  return gulp.src(["src/html/**/*.html", "src/html/favicon.ico"])
    .pipe(newer(config.dist, ".html"))
    .pipe(gulp.dest(config.dist));
});

// Copy JS libraries 
gulp.task("libcopy", function () {
  return gulp.src([
      "src/scripts/libs/**/*"
    ],
    { base: "./src/scripts/libs" }
  )
    .pipe(newer(config.dist + "/assets/libs"))
    .pipe(gulp.dest(config.dist + "/assets/libs"));
});

gulp.task('safe-regex-browserify', function () {
  // Single entry point to browserify
  gulp.src('safe-regex-shell.js')
    .pipe(browserify())
    .pipe(rename('safe-regex.js'))
    .pipe(gulp.dest(config.dist + "/assets/js"));
});

// Copy Custom JS 
gulp.task("jscopy", function () {
  return gulp.src(["src/scripts/app/pages/*.js",
    "src/scripts/app/config.js",
    "src/scripts/app/utils.js",
    "src/scripts/vendor/addclear.js",
    "src/scripts/vendor/xss.js",
    "node_modules/validator/validator.min.js"
  ])
    .pipe(newer(config.dist + "/assets/js"))
    .pipe(gulp.dest(config.dist + "/assets/js"));
});

// Copy Css 
gulp.task("csscopy", function () {
  return gulp.src(["src/styles/style.css"])
    .pipe(newer(config.dist + "/assets/temp"))
    .pipe(gulp.dest(config.dist + "/assets/temp"));
});


// Clean-all
gulp.task("clean-all", function (cb) {
  return del([
    path.join(config.dist, '*.html'),
    path.join(config.dist, '*.ico'),
    path.join(config.dist, 'assets'),
    path.join(config.dist, 'robots.txt'),
  ],cb)
});

// Strip comments from CSS using strip-css-comments
gulp.task("stripcss", function () {
  return gulp.src(config.dist + "/assets/temp/style.css")
    .pipe(stripCssComments())
    .pipe(gulp.dest(config.dist + "/assets/temp/"));
});

// Remove unnecessary css 
gulp.task("csspurify", function () {
  return gulp.src(config.dist + "/assets/temp/style.css")
    .pipe(purify(
      [
        "src/scripts/app/config.js",
        "src/scripts/app/utils.js",
        "src/scripts/app/pages/*.js",
        "src/html/*.html"
      ]
    ))

    .pipe(gulp.dest(config.dist + "/assets/css"))

    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest(config.dist + "/assets/css"))
    .pipe(size());
});

// Clean Temp Dir
gulp.task("cleantemp", function (cb) {
  del([config.dist + "/assets/temp"],cb);
});

// XSSLint - Find potential XSS vulnerabilities
gulp.task("xsslint", function () {
  var files = glob.sync("src/scripts/app/**/*.js");
  files.forEach(function (file) {
    var warnings = XSSLint.run(file);
    warnings.forEach(function (warning) {
      console.error(file + ":" + warning.line + ": possibly XSS-able `" + warning.method + "` call");
    });
  });
});

// String Validation and Sanitization
// https://www.npmjs.com/package/validator

gulp.task("validator", function () {
  console.log(validator.isEmail('foo@bar.com'));
});

gulp.task("safe-regex", function () {
  const regexs = [
    '/[0-9*]/',
    '((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}',
    '\(([0-9]{2}|0{1}((x|[0-9]){2}[0-9]{2}))\)\s*[0-9]{3,4}[- ]*[0-9]{4}'
  ];
  regexs.forEach(function (regex) {
    console.log(safe(regex));
  });
});


// CSSFilter
// gulp.task("cssfilter", function() {
//   var files = glob.sync("src/scripts/app/**/*.css");
//   files.forEach(function(file) {
//     var warnings = CSSFilter.run(file);
//     warnings.forEach(function(warning) {
//       console.error(file + ":" + warning.line + ": possibly XSS-able `" + warning.method + "` style");
//     });
//   });
// });


gulp.task('robots', function () {
  return gulp
    .src(path.join(config.src,'robots.txt'))
    .pipe(gulp.dest(config.dist));
});

// Build Task !
gulp.task("build", ["clean-all"], function (done) {
  runSequence(
    "jshint",
    "xsslint",
    //"validator",
    //"safe-regex",
    "libcopy",
    "jscopy",
    "safe-regex-browserify",
    "fonts",
    "images",
    "html",
    "robots",
    "csscopy",
    "stripcss",
    "csspurify",
    "cleantemp",
    function () {
      console.log("Build successful!");
      done();
    }
  );
});

// Default task
gulp.task("default", ["build"]);
