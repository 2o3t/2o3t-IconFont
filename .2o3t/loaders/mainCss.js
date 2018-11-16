const regex = /<%=(\s*)\${'otMainColorCss'}(\s*)=%>/;

const path = require('path');
const fs = require('fs');
const colorPath = path.resolve(process.cwd(), './public/main.color');

let css = '';
if (fs.existsSync(colorPath)) {
    const cssBuffer = fs.readFileSync(colorPath);
    css = cssBuffer.toString()
}

module.exports = function(source) {
    this.cacheable && this.cacheable();

    return source.replace(regex, encodeURIComponent(css));
};
