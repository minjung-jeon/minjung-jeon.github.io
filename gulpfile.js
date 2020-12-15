var env       = require('minimist')(process.argv.slice(2)),
  gulp        = require('gulp'),
  plumber     = require('gulp-plumber'),
  browserSync = require('browser-sync').create(),
  stylus      = require('gulp-stylus'),
  uglify      = require('gulp-uglify'),
  concat      = require('gulp-concat'),
  jeet        = require('jeet'),
  rupture     = require('rupture'),
  koutoSwiss  = require('kouto-swiss'),
  prefixer    = require('autoprefixer-stylus'),
  imagemin    = require('gulp-imagemin'),
  cp          = require('child_process');

var messages = {
  jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

var paths ={
  styles: {
    src: 'src/styl/**/*.styl',
    dest: 'assets/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'assets/js/'
  },
  images: {
    src: 'src/img/**/*.{jpg,png,gif}',
    dset: 'assets/img/'
  }
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', gulp.series(['jekyll-build']), function () {
  browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', function(done) {
  browserSync.init({
    server: {
      baseDir: '_site'
    }
  });
  done();
});

/**
 * Stylus task
 */
gulp.task('stylus', function(done){
    gulp.src('src/styl/main.styl', { since: gulp.lastRun('stylus') })
    .pipe(plumber())
    .pipe(stylus({
      use:[koutoSwiss(), prefixer(), jeet(), rupture()],
      compress: true
    }))
    .pipe(gulp.dest('_site/assets/css/'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest(paths.styles.dest));
    done();
});

/**
 * Javascript Task
 */
gulp.task('js', function(){
  return gulp.src((env.p) ? paths.scripts.src : [paths.scripts.src, '!src/js/analytics.js'], { since: gulp.lastRun('js'), sourcemaps: true })
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest));
});

/**
 * Imagemin Task
 */
gulp.task('imagemin', function() {
  return gulp.src(paths.images.src)
    .pipe(plumber())
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.images.dest));
});

/**
 * Watch stylus files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
  gulp.watch(paths.styles.src, gulp.series('stylus'));
  gulp.watch(paths.scripts.src, gulp.series('js'));
  gulp.watch(['index.html', '_includes/**/*.*', '_layouts/**/*.*', '_posts/**/*.*'], gulp.series('jekyll-rebuild'));
});

/**
 * Default task, running just `gulp` will compile the stylus,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', gulp.series(['js', 'stylus', 'browser-sync', 'watch']));
