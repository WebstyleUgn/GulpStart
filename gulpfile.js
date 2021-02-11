const { src, dest, task, series, watch, parallel } = require("gulp"),
      rm = require("gulp-rm"),
      sass = require("gulp-sass"),
      concat = require("gulp-concat"),
      browserSync = require("browser-sync"),
      reload = browserSync.reload,
      sassGlob = require("gulp-sass-glob"),
      autoprefixer = require("gulp-autoprefixer"),
      px2rem = require("gulp-smile-px2rem"),
      gcmq = require("gulp-group-css-media-queries"),
      cleanCSS = require("gulp-clean-css"),
      sourcemaps = require("gulp-sourcemaps"),
      babel = require("gulp-babel"),
      uglify = require("gulp-uglify"),
      svgo = require("gulp-svgo"),
      svgSprite = require("gulp-svg-sprite"),
      {DIST_PATH, SRC_PATH, JS_LIBS, STYLES_LIBS} = require("./gulp.config");

sass.compiler = require("node-sass");

task("clean", () => {
    return src(`${DIST_PATH}/**/*`, { read: false })
        .pipe(rm());
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: DIST_PATH
        },
        open: false
    })
});

task("copy:html", () => {
    return src(`${SRC_PATH}/*.html`)
        .pipe(dest(DIST_PATH))
        .pipe(reload({ stream: true }));
});

task("styles", () => {
    return src([...STYLES_LIBS, `${SRC_PATH}/styles/main.scss`])
        .pipe(sourcemaps.init())
        .pipe(concat("main.min.scss"))
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        .pipe(px2rem())
        .pipe(autoprefixer({
            cascade: false
        }))
        // .pipe(gcmq())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(dest(DIST_PATH))
        .pipe(reload({stream: true}));
});

task("scripts", () => {
    return src([...JS_LIBS, `${SRC_PATH}/scripts/*.js`])
        .pipe(sourcemaps.init())
        .pipe(concat("main.min.js", {newLine: "\r\n;"}))
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest(DIST_PATH))
        .pipe(reload({ stream: true }));
});

task("icons", () => {
    return src(`${SRC_PATH}/images/icons/*.svg`)
        .pipe(svgo({
            plugins: [
              {
                  removeAttrs: {
                      attrs: "(fill|stroke|style|width|height|data.*)"
                  }
              }  
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(`${DIST_PATH}/images/icons`));
});

watch(`${SRC_PATH}/**/*.scss`, series("styles"));
watch(`${SRC_PATH}/*.html`, series("copy:html"));
watch(`${SRC_PATH}/scripts/*.js`, series("scripts"));
watch(`${SRC_PATH}/images/icons/*.svg`, series("icons"));
task("default", series("clean", parallel("copy:html", "styles", "scripts", "icons"), "server"));