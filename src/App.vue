<template>
  <ot-container id="app" :class="$style.root" :theme="$otTheme">
    <ot-header :class="$style.header" :theme="$otTheme" shadow>
        <ot-nav :isCollapse="isCollapse" :theme="$otTheme" placement="right">
            <ot-link slot="left" to="/">
                <ot-logo :theme="$otTheme" icon="logo">
                    <span>2o3t-IconFont</span>
                    <!-- <span slot="subtitle">OT-UI</span> -->
                </ot-logo>
            </ot-link>
            <ot-nav-item v-for="(item) in headers" :key="item.name" :to="item.router" :href="item.href">{{item.name}}</ot-nav-item>
            <ot-row :gutter="10" :class="$style.right" slot="right">
                <ot-col :span="6">
                    <ChangeColor v-if="currentColor !== 'default'"  :theme="$otTheme"></ChangeColor>
                    <div v-else><span style="opacity: 0;">2O3T</span></div>
                </ot-col>
                <ot-col :span="6">
                    <ot-dropdown :list="dropdownList" round text-align="left" @select="handleDropdownSelect" text="THEME" custom>
                        <!-- <ot-button round>Theme</ot-button> -->
                        <div slot="item" slot-scope="{ item }">
                            <ot-radio v-if="item !== 'theme'" :theme="!isDark ? 'dark' : 'light'" size="small" v-model="currentColor" :value="item">
                                <span>{{ item.toUpperCase() }}</span>
                            </ot-radio>
                            <ot-switch v-else :value="isDark" :theme="!isDark ? 'dark' : 'light'" size="small" active-color="#13ce66" inactive-color="#ff4949">
                                <span slot="inactive">Light</span>
                                <span slot="active">Dark</span>
                            </ot-switch>
                        </div>
                    </ot-dropdown>
                </ot-col>
                <ot-col :span="12" style="text-align: right;">
                    <ot-corners href="//github.com/2o3t"></ot-corners>
                </ot-col>
            </ot-row>
        </ot-nav>
    </ot-header>
    <ot-aside :class="$style.sidebar">
        <router-view :theme="$otTheme" name="sidebar"></router-view>
    </ot-aside>
    <ot-main :class="$style.pager">
        <!-- <keep-alive> -->
        <router-view :theme="$otTheme" :class="$style.content"></router-view>
        <!-- </keep-alive> -->
    </ot-main>
  </ot-container>
</template>

<script>
import ChangeColor from '@views/ChangeThemeColor';
export default {
    name: 'app',
    components: {
        ChangeColor,
    },
    data() {
        return {
            isCollapse: false,
            isDark: false,
            theme: this.$shared.Stores.theme,
            dropdownList: [ 'default', 'primary', 'success', 'warning', 'danger', 'info', 'theme' ],
            currentColor: window.localStorage.getItem('ot-color') || 'default',
        };
    },
    watch: {
        isDark(newV, oldV) {
            if (newV !== oldV) {
                this.theme = newV ? 'dark' : 'light';
            }
        },
    },
    computed: {
        headers() {
            return this.$shared.HeaderMenu;
        },
    },
    methods: {
        handleDropdownSelect(item) {
            if (item === 'theme') {
                this.isDark = !this.isDark;
                return;
            }
            this.currentColor = item;
            if (window.localStorage) {
                window.localStorage.setItem('ot-color', item);
                this.$otMessage('正在切换主题中, 请稍等...');
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                this.$otMessage.warning('您的浏览器不支持该操作!');
            }
        },
    },
};
</script>

<style lang="scss" module>
.root {
    position: relative;
    min-height: 100%;

    &[theme='dark'] {
        background-color: #242424;
    }
}
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 6em;
    background-color: rgba($color: #ffffff, $alpha: .75);
    z-index: 10;

    &[theme='dark'] {
        background-color: rgba($color: #242424, $alpha: .75);
    }

    .nav {
        justify-content: flex-end;
    }
}
.sidebar {
    position: fixed;
    top: 6em;
    left: 0;
    width: 20em;
    bottom: 0;
    z-index: 10;
}
.pager {
    padding-left: 20em;
    padding-top: 6em;
    padding-bottom: 2em;

    .content {
        padding: 10px 30px 0px;
        box-sizing: border-box;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }
}
</style>
