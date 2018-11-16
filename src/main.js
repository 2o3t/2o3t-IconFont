import Vue from 'vue';
import App from './App.vue';

// import 'font-awesome/css/font-awesome.min.css';
import '2o3t-icon-font/dist/font-ot.css';

import '2o3t-ui/dist/styles.css';
import OTUI from '2o3t-ui';

// const hljs = require('highlight.js');
// const markdownit = require('markdown-it');
// const cheerio = require('cheerio');
// const clipboard = require('clipboard-polyfill');
Vue.use(OTUI, {
    global: true,
    // plugins: {
    //     markdownit,
    //     cheerio,
    //     clipboard,
    //     hljs,
    // },
});

let OTUI_LIB = null;
if (process.env.NODE_ENV === 'production') {
    const pkg = require('../package.json');
    require(`${pkg.name}/dist/styles.css`);
    OTUI_LIB = require(`${pkg.name}`);
} else {
    OTUI_LIB = require('@libs').default;
    console.warn('In Development !!!');
}

Vue.use(OTUI_LIB);

Vue.config.productionTip = false;

import router from '@router';

// test
import Shared from '@/shared';
Vue.use(Shared);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
