import Vue from 'vue';
import Router from 'vue-router';
import asyncImport from './asyncImport';
import createRouters from './createRouters';

Vue.use(Router);

function createSideBarView(sidebar, view) {
    return {
        // sidebar: () => asyncImport(sidebar()),
        sidebar,
        default: () => asyncImport(view()),
    };
}

// views
const Uncategorized = () => import('@views/Uncategorized');

const ComponentsSideBar = () => import('@views/SideBar/Components');
import componentsModules from '@/components';
const componentRouters = createRouters(componentsModules, index => {
    if (!index) {
        return createSideBarView(ComponentsSideBar, Uncategorized);
    }
    return createSideBarView(ComponentsSideBar, () => import(`@components/${index}`));
});

// const DesignsSideBar = () => import('@views/SideBar/Designs');
// import designsModules from '@/designs';
// const designRouters = createRouters(designsModules, index => {
//     if (!index) {
//         return createSideBarView(DesignsSideBar, Uncategorized);
//     }
//     return createSideBarView(DesignsSideBar, () => import(`@designs/${index}`));
// });

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) { return savedPosition; }
    return { x: 0, y: 0 };
};

const routerMapConfig = {
    // mode: 'history',
    scrollBehavior,
    routes: [
        {
            path: '/',
            name: 'Home-page',
            redirect: '/components/Installation',
        },
        {
            path: '/components',
            name: 'Components-page',
            redirect: '/components/Installation',
        },
        ...componentRouters,
        // {
        //     path: '/designs',
        //     name: 'Designs-page',
        //     redirect: '/designs/Disciplines',
        // },
        // ...designRouters,
        {
            path: '*',
            redirect: '/',
        },
    ],
};

export default new Router(routerMapConfig);
