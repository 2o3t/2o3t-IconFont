
### 图标展示

<ot-row-group style="text-align: center;">
    <ot-card v-for="icon in icons" :key="icon" style="min-width: 16em;">
        <div slot="top">
            <ot-icon v-bind="$otColors.color" :icon="icon" lib="font-md-places" size="5em" :local-ratio="false"></ot-icon>
        </div>
        <div slot="bottom">
            <ot-link title="Click To Copy" href="javascript:void(0);" v-ot-copy>{{ icon }}</ot-link>
        </div>
    </ot-card>
</ot-row-group>
