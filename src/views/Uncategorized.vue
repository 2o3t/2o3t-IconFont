<template>
    <div :class="$style.root" :theme="$otTheme">

        <ot-section :theme="$otTheme" label="OT-Color-Card">
            <ot-row-group :theme="$otTheme" :flex="false">
                <ot-color-card value="#FFFFFF" name="Grey Color" whiteArray :blackArray="[0, 2, 4, 8, 15, 25, 45, 65, 85, 100]" round horizontal></ot-color-card>
            </ot-row-group>
            <ot-row-group :theme="$otTheme">
                <ot-color-card value="#207FF6" name="Primary Color" :whiteArray="[]" blackArray round></ot-color-card>
                <ot-color-card value="#37C385" name="Success Color" :whiteArray="[]" blackArray></ot-color-card>
                <ot-color-card value="#FF5252" name="Danger Color" :whiteArray="[]" blackArray></ot-color-card>
                <ot-color-card value="#FFCC00" name="Warning Color" :whiteArray="[]" blackArray></ot-color-card>
                <ot-color-card value="#36AEFB" name="Info Color" :whiteArray="[]" blackArray></ot-color-card>
            </ot-row-group>
            <ot-row-group :theme="$otTheme">
                <ot-color-card value="#207FF6" name="Primary Color" round></ot-color-card>
                <ot-color-card value="#37C385" name="Success Color"></ot-color-card>
                <ot-color-card value="#FF5252" name="Danger Color"></ot-color-card>
                <ot-color-card value="#FFCC00" name="Warning Color"></ot-color-card>
                <ot-color-card value="#36AEFB" name="Info Color"></ot-color-card>
            </ot-row-group>
        </ot-section>

        <ot-section :theme="$otTheme" label="OT-Table">
            <ot-row-group :theme="$otTheme" :fixable="false">
                <ot-table :list="tableList">
                    <ot-table-column name="name" label="名称"></ot-table-column>
                    <ot-table-column name="age" label="年龄"></ot-table-column>
                    <ot-table-column name="address" label="地址"></ot-table-column>
                    <ot-table-column name="other" label="其它"></ot-table-column>
                </ot-table>
            </ot-row-group>
        </ot-section>

    </div>
</template>

<script>
export default {
    name: 'uncategorized-page',
    data() {
        return {
            alertTitle: 'Notice: Balabala...',
        };
    },
    computed: {
        tableList() {
            const list = [];
            for (let i = 0; i < 10; i++) {
                list.push({
                    name: `name_${i}`,
                    age: `age${i}`,
                    address: `address_${i}`,
                    other: `other_${i}`,
                });
            }
            return list;
        },
    },
};
</script>

<style lang="scss" module>
.root {
  padding: 10px 10px 30px;
  box-sizing: border-box;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
