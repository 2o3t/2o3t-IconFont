const path = require('path');

import config from './config.js';
const ROOT = path.resolve(config.rootDir, config.compDir);
console.log(ROOT);
