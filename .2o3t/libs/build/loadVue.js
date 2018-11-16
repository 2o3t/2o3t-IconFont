const fs = require('fs');
const path = require('path');

import config from './config.js';
const ROOT = path.resolve(config.rootDir, config.compDir);
console.log(ROOT);

const list = fs.readdirSync(ROOT);
const modules = {};
const files = list.filter(file => {
    const p = path.join(ROOT, file);
    if (fs.statSync(p).isDirectory()) {
        const indexFile = path.join(p, 'index.vue');
        return fs.existsSync(indexFile);
    }
    return /\.vue$/.test(file);
})
    .reduce((array, file) => {
        const p = path.join(ROOT, file);
        if (fs.statSync(p).isDirectory()) {
            const fp = fs.readdirSync(p);
            return fp.map(f => {
                return path.join(file, f);
            }).concat(array);
        }
        array.push(file);
        return array;
    }, [])
    .filter(file => {
        return /\.vue$/.test(file);
    })
    .map(file => {
        const p = path.join(ROOT, file);
        if (fs.statSync(p).isDirectory()) {
            return path.join(file, 'index.vue');
        }
        return file;
    });
files.forEach(key => {
    if (key === 'index.vue') return;
    const name = key.replace(/(\.\/|(\/index)?\.vue)/g, '');
    const comp = name.replace(/^\w+\//g, '');
    modules[comp] = `./${key}`;

    // console.log(`${comp} --> ./${key}`);
});

export {
    ROOT,
    modules,
};
