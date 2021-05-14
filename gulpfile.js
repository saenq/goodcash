
const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const del = require('del');
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();


function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function cleanDist() {
    return del('dist')
}


function images() {
    return src('app/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(dest('dist/images'))
}


function scripts() {
    return src([
        './node_modules/jquery/dist/jquery.js',
        './node_modules/smoothscroll-polyfill/',
        './node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function styles() {
    return src([
        'app/scss/style.scss',
    ])
        .pipe(scss({ outputStyle: 'compressed' })) // expanded красивый перенос, compressed минифицированный
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function css() {
    return src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/swiper/swiper-bundle.css',
    ])
        .pipe(concat('_libs.scss'))
        .pipe(dest('app/scss'))
        .pipe(browserSync.stream())
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/fonts/**/*',
        'app/js/main.min.js',
        'app/*.html'
    ], { base: 'app' })
        .pipe(dest('dist'))
}

function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/*.html']).on('change', browserSync.reload);
}


function deploy () {
    var config = {
        user: "user",
        // Password optional, prompted if none given
        password: "password",
        host: "host",
        port: 21,
        localRoot: __dirname + "/dist",
        remoteRoot: "/www/goodcash",
        // include: ["*", "**/*"],      // this would upload everything except dot files
        include: ["*", "**/*"],
        // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
        // exclude: ["dist/**/*.map", "node_modules/**", "node_modules/**/.*", ".git/**"],
        // delete ALL existing files at destination before uguploading, if true
        deleteRemote: false,
        // Passive mode is forced (EPSV command is not sent)
        forcePasv: true,
        // use sftp or ftp
        sftp: false
    };
    
    return ftpDeploy
        .deploy(config)
        .then(res => console.log("finished:", res))
        .catch(err => console.log(err));
}

exports.styles = styles;
exports.css = css;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.deploy = deploy;


exports.build = series(cleanDist, images, build);
exports.default = parallel(css, styles, scripts, browsersync, watching);