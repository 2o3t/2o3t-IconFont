const gulp = require('gulp');
const del = require('del');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const runTimestamp = Math.round(Date.now() / 1000);

const fs = require('fs');
const path = require('path');
// 解析文件夹
const ROOT = path.join(__dirname, './assets');
const fileNames = fs.readdirSync(ROOT).filter(name => {
    const dir = path.join(ROOT, name);
    if (fs.existsSync(dir)) {
        return fs.statSync(dir).isDirectory();
    }
    return false;
});

console.log(fileNames);
// create api
const creatApi = require('./libs/createApi');
creatApi(fileNames, ROOT);

// create Comps
const createDocs = require('./libs/createDocs');
createDocs(fileNames, ROOT);

fileNames.forEach(name => {
    const cssClass = `font-${name.replace(/-icons$/i, '')}`;
    const fontName = `2o3t-icon-font-${cssClass}`;
    const dist = `${cssClass}`; // font-ot

    gulp.task(`Iconfont:${name}`, function() {
        return gulp.src([ `assets/${name}/*.svg` ])
            .pipe(iconfontCss({
                fontName,
                // path: 'css',
                targetPath: `../${dist}.css`,
                fontPath: `./${dist}/`,
                cssClass,
            }))
            .pipe(iconfont({
                // fileName: 'font-awesome', // 上面的库不兼容
                fontName, // required
                prependUnicode: true, // recommended option
                formats: [ 'ttf', 'eot', 'woff', 'woff2', 'svg' ], // default, 'woff2' and 'svg' are available
                timestamp: runTimestamp, // recommended to get consistent builds when watching files
                normalize: true,
            }))
            .on('glyphs', function(glyphs, options) {
                // CSS templating, e.g.
                console.log(glyphs, options);
            })
            .pipe(gulp.dest(`dist/${dist}/`));
    });
});

gulp.task('clean-scripts', function(cb) {
    del([ 'dist/**/*' ]).then(() => {
        cb && cb();
    });
});

gulp.task('build-all', [ 'clean-scripts' ], function() {
    gulp.run(fileNames.map(name => {
        return `Iconfont:${name}`;
    }));
});

// build all
gulp.task('default', [ 'build-all' ]);
