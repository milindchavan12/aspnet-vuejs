var autoprefixer = require('autoprefixer'),
    browsersync = require('browser-sync').create(),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    gulp = require('gulp'),
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    svgSprite = require('gulp-svg-sprite'),
    glob = require('glob'),
    uglify  =require('gulp-uglify'); 

const paths = {
    css: {
        src: 'sass/**/*.scss',
        srcPages: 'sass/pages/*.scss',
        dest: 'css',
        main: 'sass/main.scss',
        vendors: 'sass/vendors.scss'
    },
    img: {
        src: 'images/src/**/*',
        dest: 'images/dist/'
    },
    js: {
        src: 'js/**/*',
        dest: 'js/dist'
    },
    html: '../Views/**/*.cshtml',
    env: {
        tha_dev: 'tha.int.dev',
        tha_test: 'tha.int.test',
        int_dev: 'int.dev',
        local: 'local'
    }
};

// BrowserSync
function browserSync(done) {
    browsersync.init({
        proxy: 'http://localhost:61696/'
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

//TODO: improve clean assets, create better folder structure.
// Clean assets
function clean() {
    return del(['./_site/assets/']);
}

// Optimize Images
function images() {
    return gulp
        .src(paths.img.src)
        .pipe(newer(paths.img.dest))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false,
                        collapseGroups: true
                    }]
                })
            ])
        )
        .pipe(gulp.dest(paths.img.dest));
}

//Create SVG's into one single image file
function svgs(done) {
    var pages = glob.sync('./sass/pages/**/*', { ignore: [] });
    pages.push('layout');
    pages.forEach(page => {
        page = page.replace('./sass/pages/', '');
        page = page.replace('.scss', '');
        return gulp
            .src('images/src/' + page + '/*')
            .pipe(svgSprite({
                shape: {
                    spacing: {
                        padding: 5
                    }
                },
                mode: {
                    css: {
                        dest: './',
                        layout: 'diagonal',
                        sprite: 'images/dist/' + page + '/sprite.svg',
                        bust: false,
                        render: {
                            scss: {
                                dest: 'sass/modules/sprites/_' + page + '.scss',
                                template: 'sass/modules/sprites/_' + page + 'Template.scss'
                            }
                        }
                    }
                },
                variables: {
                    mapname: 'icons'
                }
            }))
            .pipe(gulp.dest('/'));
    });
    done();
}

// CSS task
function css() {
    return gulp
        .src(paths.css.main)
        // .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browsersync.stream());
}

// CSS task for individual pages
function cssPages() {
    return gulp
        .src('sass/pages/*.scss')
        // .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/pages'))
        .pipe(browsersync.stream());
}

function scripts() {
    return (gulp
        .src([paths.js.src])
        .pipe(browsersync.stream())
    );
}

// Watch files
function watchFiles() {
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.css.srcPages, cssPages);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.html, browserSyncReload);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, images));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.cssPages = cssPages;
exports.svgs = svgs;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;