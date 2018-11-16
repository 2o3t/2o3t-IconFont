// 生成 compoents 的 index.js 文件
const Colors = require('colors');

import { ROOT, modules } from './loadVue.js';
import factory from './factory.js';

console.log(Colors.blue('\n\n ### Create Components <index.js> Start ### \n'));
factory(ROOT, modules);
console.log(Colors.blue('\n ### Create Components <index.js> End ### \n\n'));
