const { src, dest, task, series } = require("gulp"),
      rm = require("gulp-rm"),
      sass = require("gulp-sass");

sass.compiler = require("node-sass");

task("clean", () => {
    return src("dist/**/*", { read: false }).pipe(rm());
});

task("copy", () => {
    return src("src/styles/main.scss").pipe(dest("dist"));
});

task("styles", () => {
    return src("src/styles/main.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("./dist"));
});

task("default", series("clean", "styles"));