const path = require('path');
const fs = require('fs');
const initIndexs = (dirName = 'components') => {
    const compPath = path.join(process.cwd(), 'src', dirName);
    if (!fs.existsSync(compPath)) {
        return;
    }

    // first create index.js
    const indexPath = path.join(compPath, 'index.js');
    if (!fs.existsSync(indexPath)) {
        // <!-- ##&DIRNAME_NAME&## -->
        const cfText = fs.readFileSync(path.join(__dirname, '../src/index.js')).toString();
        const newText = cfText.replace(/<!-- ##&DIRNAME_NAME&## -->/igm, `/${dirName}`);
        fs.writeFileSync(indexPath, newText);
    }
    // first create CompFactory.js
    const cfPath = path.join(compPath, 'CompFactory.js');
    if (!fs.existsSync(cfPath)) {
        fs.copyFileSync(path.join(__dirname, '../src/CompFactory.js'), cfPath);
    }

    const components = fs.readdirSync(compPath);
    components.filter(name => {
        return /^\d+/ig.test(name);
    }).map(name => {
        return path.join(compPath, name);
    }).forEach(p => {
        const exists = fs.existsSync(path.join(p, 'README.md'));
        const data = `const CompFactory = require('../CompFactory').default;
const files = require.context('.', false, /\.vue$/);
const modules = CompFactory.requireModules(files);

import Config from ${exists ? "'./README.md?inject=true&name=readme'" : "'./config'"};
const template = CompFactory.getTemplate(Config, modules);

export default {
    template,
    components: modules,
};
`;
        fs.writeFileSync(path.join(p, 'index.js'), data);
    });
};

module.exports = function(args) {
    if (Array.isArray(args)) {
        args.forEach(item => {
            initIndexs(item);
        });
    } else if (typeof args === 'string') {
        initIndexs(args);
    }
};
