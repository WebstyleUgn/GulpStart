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
      cleanCSS = require("gulp-clean-css");

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
        .pipe(concat("main.scss"))
        .pipe(sassGlob())
        .pipe(sass().on("error", sass.logError))
        .pipe(px2rem())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gcmq())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest("./dist"));
});

watch("./src/**/*.scss", series("styles"));
watch("./src/*.html", series("copy:html"));
task("default", series("clean", "copy:html", "styles", "server"));