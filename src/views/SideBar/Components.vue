<template>
    <ot-menu :isCollapse="isCollapse" :theme="$otTheme">
        <ot-menu-group :label="key" v-for="key in Object.keys(slides)" :key="key">
            <ot-menu-item :theme="$otTheme" :to="item.router" v-for="item in slides[key]" :key="item.name">
                <span>{{item.label}}</span>
            </ot-menu-item>
        </ot-menu-group>
    </ot-menu>
</template>

<script>
import modules from '@components';
import createRouters from '@router/createRouters';
import { MenuMap as KEY_MAP } from '@libs/config.js';
const routers = createRouters(modules);
export default {
    name: 'side-bar-pager',
    data() {
        return {
            isCollapse: false,
        };
    },
    computed: {
        slides() {
            return this.$shared.SideBarMenu(routers, KEY_MAP, true);
        },
    },
};
</script>

<style>

</style>
