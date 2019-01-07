const fs = require('fs');
const path = require('path');
const UUID = require('uuid');
const cheerio = require('cheerio');
const { titleCase } = require('change-case');

/*
<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
    <g><rect width="1024" height="1024" opacity="0"></rect>
    </g>
</svg>
*/

module.exports = function(fileNames, root) {

    const apiRoot = path.resolve(root, '../api');
    if (!fs.existsSync(apiRoot)) {
        fs.mkdirSync(apiRoot);
    }

    // create init list
    const apiList = [];

    fileNames.forEach(name => {
        apiList.push({
            alias: titleCase(name.replace(/-icons$/ig, '')),
            name,
            api: `/api/${name}.json`,
        });

        const dest = path.join(root, name);
        const svgNameList = fs.readdirSync(dest);

        const icons = svgNameList.filter(svgName => {
            return /\.svg$/ig.test(svgName);
        }).map(svgName => {
            const svgHtml = fs.readFileSync(path.resolve(dest, svgName), 'utf-8');
            const $ = cheerio.load(svgHtml);
            const $svg = $('svg');
            $svg.find('defs').remove();
            $svg.find('style').remove();

            $svg.find('path')
                .removeAttr('id')
                .removeAttr('p-id')
                .removeAttr('class')
                .removeAttr('transform')
                .removeAttr('fill');

            const viewBox = $svg.attr('viewBox') || '';
            const sizeNums = viewBox.split(' ');

            return {
                id: UUID.v4(),
                name: svgName.replace(/\.svg$/ig, ''),
                group: name,
                viewBox,
                svg: $svg.html(),
                x: sizeNums[0] || 0,
                y: sizeNums[1] || 0,
                width: sizeNums[2] || 1024,
                height: sizeNums[3] || 1024,
            };
        });

        const result = {
            name,
            xmlns: 'http://www.w3.org/2000/svg',
            version: '1.1',
            icons,
        };

        fs.writeFileSync(path.join(apiRoot, `${name}.json`), JSON.stringify(result));
    });

    // 排序
    const resultApiList = apiList.sort((a, b) => {
        if (/^fa-/ig.test(a.name)) {
            return 1;
        }
        return a.name - b.name;
    });
    fs.writeFileSync(path.join(apiRoot, 'list.json'), JSON.stringify(resultApiList));
};
