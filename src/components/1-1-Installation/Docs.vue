<template>
    <ot-section v-bind="$attrs" :theme="$otTheme" section>
        <ot-markdown :content="markdownDoc" dangerouslyUseHTMLString></ot-markdown>
    </ot-section>
</template>

<script>
import DOC from './docs.md';
export default {
    data() {
        return {
            markdownDoc: DOC,
        };
    },
};
</script>
