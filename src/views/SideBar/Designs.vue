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
import modules from '@designs';
import createRouters from '@router/createRouters';
const routers = createRouters(modules);
const KEY_MAP = {
    1: 'Design Specifications',
    2: 'Basic',
};
export default {
    name: 'side-bar-pager',
    data() {
        return {
            isCollapse: false,
        };
    },
    computed: {
        slides() {
            return this.$shared.SideBarMenu(routers, KEY_MAP);
        },
    },
};
</script>

<style>

</style>
