
### npm 安装

使用 npm 的方式安装。

```shell
npm install -S 2o3t-ui
```

### yarn 安装 (推荐)

推荐使用 yarn 的方式安装

```shell
yarn add 2o3t-ui
```

### 初始化引入

你可以引入整个 2o3t-ui 组件。
我们的图标库暂时依赖于 font-awesome。

<ot-notice round>
一些三方库的引用, 需要通过初始化时注入其中. 否则部分组件会显示不正常.
</ot-notice>


```js
import 'font-awesome/css/font-awesome.min.css';
import '2o3t-ui/libs/styles.css';
import OTUI from '2o3t-ui';

// 三方库
const hljs = require('highlight.js');
const markdownit = require('markdown-it');
const cheerio = require('cheerio');
const clipboard = require('clipboard-polyfill');
Vue.use(OTUI, {
    global: true,
    plugins: {
        markdownit,
        cheerio,
        clipboard,
        hljs,
    },
});
```
