// const regex = /<%=(\s*)\${'otMainColorCss'}(\s*)=%>/;

// const path = require('path');
// const fs = require('fs');
// const css = fs.readFileSync(path.resolve(process.cwd(), './public/main.color'));

module.exports = function(source) {
    this.cacheable && this.cacheable();

    // return source.replace(regex, encodeURIComponent(css.toString()));

    return `export default ${JSON.stringify(source)}`;
};
