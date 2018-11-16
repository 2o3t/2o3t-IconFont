// 生成 directives 的 index.js 文件
const fs = require('fs');
const path = require('path');
const Colors = require('colors');

import config from './config.js';
const ROOT = path.resolve(config.rootDir, config.directDir);
console.log(ROOT);

const list = fs.readdirSync(ROOT);
const modules = {};
const files = list.filter(file => {
    return /\.js$/.test(file);
});
files.forEach(key => {
    if (key === 'index.js' || key === '_index.js') return;
    modules[key.replace(/(\.\/|\.js)/g, '')] = `./${key}`;
});

import factory from './factory.js';

console.log(Colors.blue('\n\n ### Create Directives <index.js> Start ### \n'));
factory(ROOT, modules);
console.log(Colors.blue('\n ### Create Directives <index.js> End ### \n\n'));
