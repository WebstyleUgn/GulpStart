const { src, dest, task, series, watch } = require("gulp"),
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
      svgSprite = require("gulp-svg-sprite");

sass.compiler = require("node-sass");

task("clean", () => {
    return src("dist/**/*", { read: false })
        .pipe(rm());
});

task("server", () => {
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        open: false
    })
});

task("copy:html", () => {
    return src("src/*.html")
        .pipe(dest("dist"))
        .pipe(reload({ stream: true }));
});

const styles = [
    "node_modules/normalize.css/normalize.css",
    "src/styles/main.scss"
];

task("styles", () => {
    return src(styles)
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
        .pipe(dest("./dist"))
        .pipe(reload({stream: true}));
});

const libs = [
    "node_modules/jquery/dist/jquery.js",
    "src/scripts/*.js"
]

task("scripts", () => {
    return src(libs)
        .pipe(sourcemaps.init())
        .pipe(concat("main.min.js", {newLine: "\r\n;"}))
        .pipe(babel({
            presets: ["@babel/env"]
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(dest("dist"))
        .pipe(reload({ stream: true }));
});

task("icons", () => {
    return src("src/images/icons/*.svg")
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
        .pipe(dest("dist/images/icons"));
});

watch("./src/**/*.scss", series("styles"));
watch("./src/*.html", series("copy:html"));
watch("./src/scripts/*.js", series("scripts"));
watch("./src/images/icons/*.svg", series("icons"));
task("default", series("clean", "copy:html", "styles", "scripts", "icons", "server"));