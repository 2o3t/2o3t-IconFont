<template>
    <ot-color-picker ot :theme="$otTheme" round v-model="color" @change="changeColor"></ot-color-picker>
</template>

<script>
import MAIN_CSS from '2o3t-css-colors/public/2o3t-ui/main.color';
const ID_NAME = '__custom_theme_color__';
const CURRENT_COLOR_NAME = window.localStorage ? window.localStorage.getItem('ot-color') || 'default' : 'default';
const OT_COLOR_POOLS = {
    default: '#314659',
    white: '#FFFFFF',
    black: '#000000',
    primary: '#207FF6',
    success: '#37C385',
    warning: '#FFCC00',
    danger: '#FF5252',
    info: '#36AEFB',
};
const DEFAULT_COLOR = OT_COLOR_POOLS[CURRENT_COLOR_NAME] || '#207FF6';
export default {
    name: 'ui-change-theme-color',
    data() {
        return {
            color: DEFAULT_COLOR,
        };
    },
    methods: {
        changeColor() {
            const mix = this.$shared.Color.mix;
            const color = this.color;

            if (!color || !/^[#]?[0-9A-F]{6}$/ig.test(color)) {
                console.warn('color is error!! ', color);
                return null;
            }

            function mixin(c1, c2) {
                const r = [];
                for (let i = 0; i < 9; i++) {
                    r.push(mix(c1, c2, (i + 1) * 0.1));
                }
                return r;
            }

            function create(c) {
                return [
                    c,
                    ...mixin('#FFFFFF', c),
                    ...mixin('#000000', c),
                ];
            }

            const oldColorPools = create(DEFAULT_COLOR); // 主颜色
            const newColorPools = create(color);

            const cssColor = oldColorPools.reduce((result, oldC, index) => {
                const reg = new RegExp(oldC, 'igm');
                return result.replace(reg, function() {
                    return newColorPools[index];
                });
            }, MAIN_CSS);

            const old = window.document.getElementById(ID_NAME);
            if (old) {
                old.innerHTML = cssColor;
            } else {
                const style = window.document.createElement('style');
                style.type = 'text/css';
                style.id = ID_NAME;
                style.innerHTML = cssColor;
                window.document.getElementsByTagName('HEAD').item(0).appendChild(style);
            }
        },
        removeColor() {
            const old = window.document.getElementById(ID_NAME);
            if (old) {
                old.innerHTML = '';
            }
        },
    },
    beforeDestroy() {
        this.removeColor();
    },
};
</script>
