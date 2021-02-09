const { src, dest, task, series, watch } = require("gulp"),
      rm = require("gulp-rm"),
      sass = require("gulp-sass"),
      concat = require("gulp-concat");

sass.compiler = require("node-sass");

task("clean", () => {
    return src("dist/**/*", { read: false }).pipe(rm());
});

task("copy", () => {
    return src("src/styles/main.scss").pipe(dest("dist"));
});

const styles = [
    "node_modules/normalize.css/normalize.css",
    "src/styles/main.scss"
];

task("styles", () => {
    return src(styles)
        .pipe(concat("main.scss"))
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./dist"));
});

watch('./src/**/*.scss', series('styles'));
task("default", series("clean", "styles"));