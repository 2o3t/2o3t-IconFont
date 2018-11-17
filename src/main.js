import Vue from 'vue';
import App from './App.vue';

// import 'font-awesome/css/font-awesome.min.css';
import '2o3t-icon-font/dist/font-ot.css';
import '2o3t-icon-font/dist/font-fa-brands.css';
import '2o3t-icon-font/dist/font-fa-regular.css';
import '2o3t-icon-font/dist/font-fa-solid.css';

import '2o3t-ui/dist/styles.css';
import OTUI from '2o3t-ui';

const color = window.localStorage && window.localStorage.getItem('ot-color') || null;
Vue.use(OTUI, {
    global: true,
    color,
});

if (process.env.NODE_ENV !== 'production') {
    console.warn('In Development !!!');
}

Vue.config.productionTip = false;

import router from '@router';

// test
import Shared from '@/shared';
Vue.use(Shared);

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
