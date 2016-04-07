// == Imports ===============================================================

var gulp = require('gulp');
var path = require('path');

var browserify = require('browserify');
var source = require('vinyl-source-stream');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var gulp_util = require('gulp-util');
var jshint = require('gulp-jshint');
var jade = require('gulp-jade');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var rename = require('gulp-rename');
var order = require('gulp-order');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');

var ifnotexist = require('./lib/gulp/ifnotexist');

// == Constants =============================================================

var configDir = path.resolve(__dirname, 'config');

var config = {
  app: {
    sources: [
      'lib/**/*.js',
      'models/**/*.js',
      'routes/**/*.js'
    ]
  },
  components: {
    sources: [
      'components/*.jade'
    ],
    target: 'public/components'
  },
  css: {
    sources: [
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
      'bower_components/selectize/dist/css/selectize.css',
      'bower_components/dropzone/dist/dropzone.css',
      'bower_components/animate.css/animate.css',
      'assets/styles/application.less'
    ],
    target: 'public/css'
  },
  javascripts: {
    sources: [
      'bower_components/microplugin/src/microplugin.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/dropzone/dist/dropzone.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
      'bower_components/sifter/sifter.js',
      'bower_components/selectize/dist/js/selectize.js',
      'bower_components/lodash/lodash.js',
      'node_modules/socket.io-client/socket.io.js',
      'assets/browserify/build/*.js',
      'assets/js/**/*.js'
    ],
    target: 'public/js'
  },
  images: {
    sources: [
      'assets/images/**/*.png',
      'assets/images/**/*.jpg',
      'assets/images/**/*.gif'
    ],
    target: 'public/images'
  },
  icons: {
    sources: [
      'assets/icons/*.ico'
    ],
    target: 'public'
  },
  fonts: {
    sources: [
      'bower_components/bootstrap/fonts/*'
    ],
    target: 'public/fonts'
  }
};

// == Tasks =================================================================

gulp.task('lint', function() {
  var sources = [ ].concat(config.app.sources).concat(config.javascripts.sources);

  return gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

gulp.task('css', function() {
  return gulp.src(config.css.sources)
    // .pipe(rev())
    .pipe(less({ style: 'compressed' }).on('error', gulp_util.log))
    .pipe(concat('app.css'))
    .pipe(gulp.dest(config.css.target));
});

gulp.task('browserify', function() {
  return browserify(
      './assets/browserify/pdfkit.js',
      {
        transform: 'brfs'
      }
    )
    .bundle()
    .pipe(source('pdfkit.js'))
    .pipe(gulp.dest('./assets/browserify/build/'));
});

gulp.task('scripts', function() {
  return gulp.src(config.javascripts.sources)
    // .pipe(rev())
    .pipe(concat('app.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(config.javascripts.target));
});

gulp.task('fonts', function() {
  return gulp.src(config.fonts.sources)
    .pipe(gulp.dest(config.fonts.target));
});


gulp.task('images', function() {
  return gulp.src(config.images.sources)
    .pipe(gulp.dest(config.images.target));
});

gulp.task('icons', function() {
  return gulp.src(config.icons.sources)
    .pipe(gulp.dest(config.icons.target));
});

gulp.task('components', function() {
  return gulp.src(config.components.sources)
    .pipe(jade())
    .pipe(gulp.dest(config.components.target))
});

gulp.task('watch', function() {
  gulp.watch(config.css.sources, [ 'css' ]);
  gulp.watch(config.javascripts.sources, [ 'scripts' ]);
  gulp.watch(config.fonts.sources, [ 'fonts' ]);
  gulp.watch(config.images.sources, [ 'images' ]);
  gulp.watch(config.icons.sources, [ 'icons' ]);
  gulp.watch(config.components.sources [ 'components' ]);
});

gulp.task('nodemon_server', function() {
  return nodemon({
    script: './lib/servers',
    watch: [
      'lib',
      'routes',
      'models',
      'assets',
      'app.js'
    ],
    ext: 'js',
    ignore: [
      'test/*',
      'assets/*',
      'bower_components/*',
      'node_modules/*',
      'public/*'
    ],
    delay: 1
  });
});

gulp.task('routes', function() {
  var app = require('./app');
  
  app._router.stack.forEach(function(route) {
    console.log(route.regexp);
  })
})

gulp.task('build', [
  'css',
  'browserify',
  'scripts',
  'fonts',
  'images',
  'icons',
  'components'
]);

gulp.task('config', function() {
  gulp.src(configDir + '/*.example')
    .pipe(rename(function(path) { path.extname = ''}))
    .pipe(ifnotexist())
    .pipe(gulp.dest(configDir))
});

gulp.task('migrate', function() {
  return sequelize.migrate();
});

gulp.task('server', [ 'build', 'watch', 'nodemon_server' ]);

gulp.task('default', [ 'build' ]);
