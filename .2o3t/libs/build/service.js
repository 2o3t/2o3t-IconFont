// 生成 services 的 index.js 文件
const Colors = require('colors');

import { ROOT, modules } from './loadJS.js';
import factory from './factory.js';

console.log(Colors.blue('\n\n ### Create Service <index.js> Start ### \n'));
factory(ROOT, modules);
console.log(Colors.blue('\n ### Create Service <index.js> End ### \n\n'));
