<template>
    <ot-section v-bind="$attrs" :theme="$otTheme" section>
        <ot-markdown :content="markdownDoc" dangerouslyUseHTMLString></ot-markdown>
        <ot-markdown :content="markdownIcons" dangerouslyUseHTMLString :data="{ icons }"></ot-markdown>
    </ot-section>
</template>

<script>
import DOC from './docs.md';
import ICONS from './icons.md';
export default {
    data() {
        return {
            markdownDoc: DOC,
            markdownIcons: ICONS,
        };
    },
    computed: {
        icons() {
            const files = require.context('@font/md-toggle-icons/', true, /\.svg$/i);
            return files.keys().map(item => {
                return item.replace(/(\.\/|\.svg)/g, '');
            });
        },
    },
};
</script>
