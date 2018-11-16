const regex = /<%=(\s*)\${'otSourceCode'}(\s*)=%>/;
const deleteRegex = /(.*)<%=(\s*)\${'otSourceCode'}(\s*)=%>(.*)\n/;
const deleteRegex2 = /\s+:code="\w+">/;
const deleteRegex3 = /\s+:theme="\$\w+"/igm;
const deleteRegex4 = /\s+v-bind="\$attrs"/igm; //  v-bind="$attrs"

module.exports = function(source) {
    this.cacheable && this.cacheable();

    // 赋值源码
    const _sourceCode = String.prototype.trim.call(source)
        .replace(deleteRegex, '')
        .replace(deleteRegex2, '>')
        .replace(deleteRegex3, '')
        .replace(deleteRegex4, '');
    return source.replace(regex, encodeURIComponent(_sourceCode));
};
