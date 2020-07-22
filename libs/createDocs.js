const fs = require('fs-extra');
const path = require('path');
const { upperCaseFirst, camelCase, titleCase } = require('change-case');

module.exports = function(fileNames, root) {

    const { ClassifyMap, MenuMap } = require('./config');

    const apiRoot = path.resolve(root, '../src/components');
    fs.ensureDirSync(apiRoot);

    const INCLUDES_DIRS = fs.readdirSync(apiRoot);

    const KEY = /###NAME###/gm;
    const TITLE_KEY = /###TITLE_NAME###/gm;

    const classifyIndex = {};
    fileNames.forEach(name => {
        const uniqName = name.replace(/-icons$/ig, '');
        const classify = uniqName.split('-')[0];
        const c_i = ClassifyMap[classify];
        const titleName = MenuMap[c_i] || titleCase(uniqName);
        const dirname = upperCaseFirst(camelCase(uniqName));
        console.warn('dirname: ', dirname);
        if (INCLUDES_DIRS.some(n => {
            return n.includes(dirname);
        })) {
            return; // next
        }

        // 1.文件夹
        // 2.copy
        const templatePath = path.join(__dirname, 'template');
        const INDEX = classifyIndex[c_i] = classifyIndex[c_i] ? classifyIndex[c_i]++ : 1;
        const dest = path.join(apiRoot, `${c_i}-${INDEX}-${dirname}`);
        fs.copySync(templatePath, dest);
        fs.readdirSync(dest).forEach(file => {
            const filepath = path.join(dest, file);
            const text = fs.readFileSync(filepath, 'utf8').toString()
                .replace(TITLE_KEY, titleName)
                .replace(KEY, uniqName);
            fs.writeFileSync(filepath, text);
        });
    });

};
