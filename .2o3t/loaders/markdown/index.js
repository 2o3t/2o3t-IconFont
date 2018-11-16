const loaderUtils = require('loader-utils');
const MarkdownIt = require('markdown-it');
const cheerio = require('cheerio');
const readme = require('./readme');

const replaceTag = require('./replaceTag');

module.exports = function(source) {
    this.cacheable && this.cacheable();

    const params = this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : undefined;
    if (params && params.inject === true && params.name === 'readme') {
        return readme(source);
    }

    const mdParser = new MarkdownIt();

    const result = mdParser.render(source);

    // const $ = cheerio.load(result, {
    //     decodeEntities: false,
    //     lowerCaseAttributeNames: false,
    //     lowerCaseTags: false,
    // });

    // // 替换
    // replaceTag($);

    // const html = $('body').html();

    return 'export default ' + JSON.stringify(result);
};
