const MarkdownIt = require('markdown-it');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Colors = require('colors');

const replaceTag = require('./replaceTag');

module.exports = function(source) {
    this.cacheable && this.cacheable();

    const mdParser = new MarkdownIt();

    const result = mdParser.render(source);

    const $ = cheerio.load(result, {
        decodeEntities: false,
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
    });

    const config = {};
    config.LABEL = $('h1').first().text();
    config.DESC = $('h1').next('p').first()
        .text()
        .replace('\n', '');

    const $h2 = $('h2');
    config.COMPONENTS = $h2.toArray().reduce((obj, element, index) => {
        const $el = $h2.eq(index);
        const name = $el.text();
        const key = $el.next('blockquote').children('p').text();

        const desc = [];
        const currAllEls = $el.next('blockquote').nextAll();
        if (currAllEls && currAllEls.length) {
            for (let i = 0; i < currAllEls.length; i++) {
                const currEl = currAllEls[i];
                if (/^h\w+/i.test(currEl.tagName)) {
                    break;
                }
                desc.push($.html(currEl));
            }
        }

        obj[key] = {
            LABEL: name,
            DESC: desc.join('\n'),
        };
        return obj;
    }, {});

    config.COMPONENTS.__markdown = true;

    // 替换
    replaceTag($);

    // api
    const $h3 = $('h3');
    if ($h3.length) {
        const table = $h3.next('table').html();
        config._API_ = `<ot-markdown customClass="ot-api-container"><ot-table-ui>${table}</ot-table-ui></ot-markdown>`;
    }

    const apiUrl = $.html().toString().match(/\<\!--\s*@api:(.*?)\s*--\>/ig);
    if (apiUrl) {
        const ROOT = process.cwd();
        const maxCount = apiUrl.length;
        const htmls = apiUrl.map(api => {
            return api.replace(/\<\!--\s*@api:\s*(.*?)\s*--\>/ig, '$1');
        }).map(url => {
            // 特殊处理
            // @api: OtButton.vue/OtButtonAPI.md
            let mdPath = path.resolve(ROOT, path.join('libs', url));
            if (!fs.existsSync(mdPath)) {
                mdPath = path.resolve(ROOT, path.join('libs', 'components', url));
            }
            if (fs.existsSync(mdPath)) {
                console.log(Colors.grey(`\n\n# Read API Markdown! <${mdPath}>\n\n`));
                const mdText = fs.readFileSync(mdPath);
                const mdParser = new MarkdownIt();
                const result = mdParser.render(mdText.toString());
                const $ = cheerio.load(result, {
                    decodeEntities: false,
                    lowerCaseAttributeNames: false,
                    lowerCaseTags: false,
                });
                if (maxCount <= 1) {
                    $('h1').remove();
                } else {
                    $('h1').each((index, h) => {
                        h.tagName = 'H2';
                    });
                }
                $('h2').each((index, h) => {
                    h.tagName = 'H3';
                });
                $('h3').each((index, h) => {
                    h.tagName = 'H4';
                });
                $('h4').each((index, h) => {
                    h.tagName = 'H5';
                });
                $('h5').each((index, h) => {
                    h.tagName = 'H6';
                });

                // 替换
                replaceTag($);

                const html = $('body').html();
                return `<ot-markdown customClass="ot-api-container">${html}</ot-markdown>`;
            }
            console.error(Colors.yellow(`\n\n[!!!] Dont Find File <${mdPath}>!!\n\n`));
            return '';
        });
        config._API_ = htmls.join('\n');
    }

    return 'export default ' + JSON.stringify(config);
};
