const path = require('path');
const debug = process.env.NODE_ENV !== 'production';

const autoBuildIndex = require('./.2o3t/bin/autoBuildIndex');
autoBuildIndex([
    'components',
]);

const customLoader = require('./.2o3t/loaders');

const PRODUCTION_BASE_URL = '<!-- ##&PROJECT_NAME&## -->';

const vueConfig = {
    baseUrl: debug ? '/' : PRODUCTION_BASE_URL,
    outputDir: 'webs',
    configureWebpack: config => {
        // webpack配置，值位对象时会合并配置，为方法时会改写配置
        if (debug) { // 开发环境配置
            config.devtool = 'cheap-module-eval-source-map';
        } else { // 生产环境配置
            const externals = config.externals || {};
            Object.assign(config, {
                externals: Object.assign(externals, {
                    // 'highlight.js': 'hljs',
                    // 'markdown-it': 'markdownit',
                    // clipboard: 'clipboard-polyfill',
                }),
            });
        }
        Object.assign(config, { // 开发生产共同配置
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@router': path.resolve(__dirname, './src/router'),
                    '@assets': path.resolve(__dirname, './src/assets'),
                    '@views': path.resolve(__dirname, './src/views'),
                    '@components': path.resolve(__dirname, './src/components'),
                    '@designs': path.resolve(__dirname, './src/designs'),
                    '@libs': path.resolve(__dirname, './libs'),
                    vue$: 'vue/dist/vue.esm.js',
                },
                extensions: [ '.js', '.vue', '.json', '.css' ],
            },
        });
    },
    chainWebpack: config => {
        customLoader(config);
    },
};

module.exports = vueConfig;
