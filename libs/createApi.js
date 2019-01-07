const fs = require('fs');
const path = require('path');
const UUID = require('uuid');
const cheerio = require('cheerio');

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
                .removeAttr('p-id');

            return {
                id: UUID.v4(),
                name: svgName.replace(/\.svg$/ig, ''),
                group: name,
                svg: $svg.html(),
            };
        });

        const result = {
            name,
            prefix: '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><g><rect width="1024" height="1024" opacity="0"></rect>',
            suffix: '</g></svg>',
            icons,
        };

        fs.writeFileSync(path.join(apiRoot, `${name}.json`), JSON.stringify(result));
    });

    fs.writeFileSync(path.join(apiRoot, 'list.json'), JSON.stringify(apiList));
};