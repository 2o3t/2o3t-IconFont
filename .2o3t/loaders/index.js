const path = require('path');

const chainWebpack = config => {
    config.module
        .rule('html')
        .test(/.vue$/i)
        .include
        .add(path.resolve(process.cwd(), './src/components'))
        .end()
        .use()
        .loader(path.resolve(__dirname, './template.js'))
        .end();

    // markdown
    config.module
        .rule('markdown')
        .test(/.md$/i)
        .use()
        .loader(path.resolve(__dirname, './markdown/index.js'))
        .end();

    config.module
        .rule('OT-Colors')
        .test(/.color$/i)
        // .include
        // .add(path.resolve(process.cwd(), './src/views'))
        // .end()
        .use()
        .loader(path.resolve(__dirname, './mainCss.js'))
        .end();
}

module.exports = chainWebpack;
