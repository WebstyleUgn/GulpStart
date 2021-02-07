const { src, dest, task, series } = require("gulp"),
      rm = require("gulp-rm");

task("clean", () => {
    return src("dist/**/*", { read: false }).pipe(rm());
});

task("copy", () => {
    return src("src/styles/main.scss").pipe(dest("dist"));
});

task("default", series("clean", "copy"));