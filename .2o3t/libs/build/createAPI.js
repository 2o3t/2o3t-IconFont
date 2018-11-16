// 生成 compoents 的 API.MD 文件
import { ROOT, modules } from './loadVue.js';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as bt from '@babel/types';
const babelParser = require('@babel/parser');
const Colors = require('colors');

const fs = require('fs');
const path = require('path');

// API 结构
// {
//     classification: [props, events, slots, scopedSlots],
//     name: '参数名称',
//     describe: ['说明'], // 可进行注释解析
//     type: [ 类型 ],
//     default: '-' // 默认值
// }

/* eslint no-new-func: "off" */
class ParserVue {
    constructor(content, name, file, fp) {
        this._content = content;
        this._path = fp;
        this._name = name;
        this._relative = file;

        this.enabled = false;
        this._init();
    }

    _init() {
        const array = this._relative.split('/');
        this.enabled = array && array.length > 2; // 只有文件夹才开启

        // 解析文件夹名称
        const dirName = this._relative.replace(/^\.\/|\/\w+\.vue$/ig, '');
        this._dirname = dirName;
        this._root = path.join(ROOT, dirName);

        // 结果集
        this.result = {
            props: [],
            events: [],
            slots: [],
            scopedSlots: [],
        };
    }

    eqDir(parser) { // 同一个文件夹下
        return this._dirname === parser._dirname;
    }

    isEmpty() {
        return this.result.props.length <= 0
        && this.result.events.length <= 0
        && this.result.slots.length <= 0
        && this.result.scopedSlots.length <= 0;
    }

    // 进行注释处理
    _getComments(cnode) {
        const res = {
            default: [],
        };
        const commentNodes = cnode.leadingComments;
        if (!commentNodes || !commentNodes.length) return res;

        const commentRE = /\n\s*\*?\s*/g;
        const leadRE = /^@(\w+)\b/;

        let comments = '';
        let matchs;
        commentNodes.forEach(node => {
            if (this._isCommentLine(node)) {
                comments = node.value.trim();
                matchs = comments.match(leadRE);
                if (matchs) {
                    const key = matchs[1];
                    res[key] = res[key] || [];
                    res[key].push(comments.replace(leadRE, ''));
                } else {
                    res.default.push(comments);
                }
            } else if (this._isCommentBlock(node)) {
                comments = node.value
                    .replace(commentRE, '\n')
                    .replace(/^\*/, '')
                    .trim();
                let currentKey = 'default';
                comments.split('\n').forEach(c => {
                    if ((matchs = c.match(leadRE))) {
                        currentKey = matchs[1];
                        res[currentKey] = res[currentKey] || [];
                        res[currentKey].push(c.replace(leadRE, '').trim());
                    } else {
                        res.default.push(c);
                    }
                });
            }
        });
        return res;
    }

    _isCommentLine(node) {
        return node.type === 'CommentLine';
    }

    _isCommentBlock(node) {
        return node.type === 'CommentBlock';
    }

    _getValueFromGenerate(node) {
        let code = 'return';
        const { code: genCode } = generate(node);
        code += genCode;
        const fn = new Function(code);
        try {
            return fn();
        } catch (e) {
            console.error(e);
        }
    }

    _isVueComponent(node) {
        return bt.isExportDefaultDeclaration(node);
    }

    _isVueOption(path, optionsName) {
        if (
            bt.isObjectProperty(path.node) &&
          path.parentPath &&
          path.parentPath.parentPath &&
          this._isVueComponent(path.parentPath.parentPath.node)
        ) {
            const keyPath = path.get('key');
            return keyPath.node.name === optionsName;
        }
        return false;
    }

    // The `type` of a prop should be an array of constructors or constructors
    // eg. String or [String, Number]
    _isAllowPropsType(typeNode) {
        return bt.isIdentifier(typeNode) || bt.isArrayExpression(typeNode);
    }

    _normalizeProps(props) {
        return props.map(prop => ({
            type: null,
            name: prop,
        }));
    }

    _getTypeByPath(typePath) {
        const typeNode = typePath.node;
        if (bt.isIdentifier(typeNode)) return typeNode.name;
        if (bt.isArrayExpression(typeNode)) {
            if (!typeNode.elements.length) return null;
            return typePath
                .get('elements.0')
                .container.filter(node => bt.isIdentifier(node))
                .map(node => node.name);
        }
        return null;
    }

    _hasFunctionTypeDef(type) {
        if (typeof type === 'string') {
            return type.toLowerCase() === 'function';
        } else if (Array.isArray(type)) {
            return type.map(a => a.toLowerCase()).some(b => b === 'function');
        }
        return false;
    }

    _runFunction(fnCode) {
        const { code: genCode } = generate(fnCode);
        const code = `return (${genCode})()`;
        const fn = new Function(code);
        try {
            return fn();
        } catch (e) {
            console.error(e);
        }
    }

    parserProps() {
        const content = this._content;
        const _self = this;
        // const propsReg = /^[ ]{4}props\s*:\s*\{((?:.*\s)+?)[ ]{4}\}/ig;
        // const scriptReg = /^[ ]*\<script\>(?:.*\s)*?export\s+default\s+((?:.*\s)+?);?\<\/script\>/igm;
        const scriptReg = /^[ ]*\<script\>((?:.*\s)+?);?\<\/script\>/igm;
        const scriptRegExpExecArray = scriptReg.exec(content);
        if (scriptRegExpExecArray && scriptRegExpExecArray.length > 1) {
            const js = scriptRegExpExecArray[1];
            // console.log(js);
            const babelFile = babelParser.parse(js, {
                sourceType: 'module',
                plugins: [ 'objectRestSpread', 'dynamicImport', 'jsx' ],
            });

            // 通过babel 进行处理
            traverse(babelFile, {
                ObjectProperty(path) {
                    if (_self._isVueOption(path, 'props') || _self._isVueOption(path, 'docs')) {
                        const valuePath = path.get('value');
                        let res = [];
                        if (bt.isArrayExpression(valuePath.node)) {
                            // An array of strings
                            const propsValue = _self._getValueFromGenerate(valuePath.node);
                            res = _self._normalizeProps(propsValue);
                        } else if (bt.isObjectExpression(valuePath.node)) {
                            // An object
                            valuePath.traverse({
                                ObjectProperty(propPath) {
                                    // Guarantee that this is the prop definition
                                    if (propPath.parentPath === valuePath) {
                                        const name = propPath.node.key.name;
                                        const vPath = propPath.get('value');
                                        const result = {
                                            name,
                                            type: null,
                                            describe: _self._getComments(propPath.node).default,
                                        };
                                        if (_self._isAllowPropsType(vPath.node)) {
                                            result.type = _self._getTypeByPath(vPath);
                                        } else if (bt.isObjectExpression(vPath.node)) {
                                            if (!vPath.node.properties.length) return;

                                            const allPropNodes = vPath.get('properties.0').container;
                                            const typeNode = allPropNodes.filter((node, i) => {
                                                if (node.key.name === 'type') {
                                                    node.$$selfPath = vPath.get(`properties.${i}`);
                                                    return true;
                                                }
                                                return false;
                                            });
                                            const otherNodes = allPropNodes.filter(
                                                (node, i) => {
                                                    if (node.key.name !== 'type') {
                                                        node.$$selfPath = vPath.get(`properties.${i}`);
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                            );

                                            // Prioritize `type` before processing `default`.
                                            // Because the difference in `type` will affect the way `default` is handled.
                                            if (typeNode.length > 0) {
                                                result.type = _self._getTypeByPath(
                                                    typeNode[0].$$selfPath.get('value')
                                                );
                                                // Get descriptions of the type
                                                const typeDesc = _self._getComments(typeNode[0]).default;
                                                if (typeDesc.length > 0) {
                                                    result.typeDesc = typeDesc;
                                                }
                                            }

                                            otherNodes.forEach(node => {
                                                const n = node.key.name;
                                                if (n === 'default') {
                                                    if (!_self._hasFunctionTypeDef(result.type) && bt.isFunction(node.value)) {
                                                        result.default = _self._runFunction(node.value);
                                                    } else {
                                                        if (bt.isObjectMethod(node)) {
                                                            result.default = generate(node).code;
                                                        } else {
                                                            result.default = generate(node.value).code;
                                                        }
                                                    }

                                                    // Get descriptions of the default value
                                                    const defaultDesc = _self._getComments(node).default;
                                                    if (defaultDesc.length > 0) {
                                                        result.defaultDesc = defaultDesc;
                                                    }
                                                } else if (n === 'required') {
                                                    if (bt.isBooleanLiteral(node.value)) {
                                                        result.required = node.value.value;
                                                    }
                                                } else if (n === 'validator') {
                                                    if (bt.isObjectMethod(node)) {
                                                        result.validator = generate(node).code;
                                                    } else {
                                                        result.validator = generate(node.value).code;
                                                    }

                                                    // Get descriptions of the validator
                                                    const validatorDesc = _self._getComments(node).default;
                                                    if (validatorDesc.length > 0) {
                                                        result.validatorDesc = validatorDesc;
                                                    }
                                                }
                                            });

                                        }
                                        res.push(result);
                                    }
                                },
                            });
                        }

                        // console.log(res);
                        _self.result.props = res;
                    }
                },
            });
        }
    }

    parserEvents() {
        const content = this._content;
        const eventsRegex = /(?:\w+\.)?\$emit\(['|"]{1}(\w+?)['|"]{1}(?:,?\s*(.*))?\);?(?:[ ]*\/\/(.*))?/ig;
        const events = [];
        let er = eventsRegex.exec(content);
        while (er != null) {
            events.push({
                name: `@${er[1]}`,
                type: `(${er[2] ? er[2].replace(/this\./ig, '') : ' '}): Void`,
                describe: er[3] ? [ er[3] ] : [ ],
                default: '-',
            });
            er = eventsRegex.exec(content);
        }
        // console.log(events);
        this.result.events = events;
    }

    parserSlots() {
        const content = this._content;
        const slotsRegex = /(?:\<\!--\s*(.*?)\s*--\>\s*)?\<slot(?!\s*name=)[\s\w-='"]*?\>([\s\S]*?)\<\/slot\>/igm;
        const slots = [];
        let sr = slotsRegex.exec(content);
        while (sr != null) {
            let def = '-';
            if (sr[2]) {
                def = '-';
            }
            slots.push({
                name: 'default',
                type: '-',
                describe: sr[1] ? [ sr[1] ] : [ ],
                default: `${def}`,
            });
            sr = slotsRegex.exec(content);
        }
        // console.log(slots);
        this.result.slots = slots;
    }

    parserScopedSlots() {
        const content = this._content;
        const scopedSlotsRegex = /(?:\<\!--\s*(.*?)\s*--\>\s*)?\<slot\s+name=['|"]{1}(.*?)['|"]{1}\s*(.*?)\>([\s\S]*?)\<\/slot\>/igm;
        const scopedSlots = [];
        let ssr = scopedSlotsRegex.exec(content);
        while (ssr != null) {
            scopedSlots.push({
                name: ssr[2],
                type: ssr[3] ? ssr[3].replace(/v-(if|show)=['|"]{1}(.*?)['|"]{1}/ig, '') : '-',
                describe: ssr[1] ? [ ssr[1] ] : [ ],
                default: `${'-'}`,
            });
            ssr = scopedSlotsRegex.exec(content);
        }
        // console.log(scopedSlots);
        this.result.scopedSlots = scopedSlots;
    }

    run() {
        if (!this.enabled) return null;
        // to do

        this.parserProps();
        this.parserEvents();
        this.parserSlots();
        this.parserScopedSlots();

        return this;
    }

    _createTable(name = 'unknow') {
        const arr = this.result[name] || [];
        if (arr.length <= 0) {
            return '';
        }
        name = name[0].toUpperCase() + name.substring(1);
        let text = `## ${name}\n\n`;
        text += '| 参数 | 说明 | 类型 | 默认值 |\n';
        text += '| --- | --- | --- | --- |\n';
        if (/^props$/ig.test(name)) {
            text += '| theme | 可选, 更改主题颜色, 支持 `light`, `dark` | String | light |\n';
            text += '| size | 可选, 选择控件大小, 可选参数 `mini`, `small`, `normal`, `big` | String | normal |\n';
            text += '| color | 可选, 更改主题色, 可选参数 `default`, `primary`, `success`, `warning`, `danger`, `info` | String | default |\n';
            text += '| border | 可选(非必支持), UI增加边框 | Boolean | false |\n';
            text += '| round | 可选(非必支持), UI边框圆角 | Boolean | false |\n';
        }
        text += arr.map(item => {
            let describe = item.describe.length > 0 ? item.describe.join('\n') : '-';
            if (item.validator && item.validatorDesc) {
                describe = `**${item.validatorDesc}**, ${describe}`;
            }
            if (item.required === true) {
                describe = `***必填***, ${describe}`;
            }
            let def = item.defaultDesc || (item.default === undefined) ? '-' : item.default;
            if (/^default()/.test(def)) {
                def = def.replace(/^default\(\)/, '()=>').replace(/\n/igm, ' ');
            }
            return `| ${item.name} | ${describe} | ${item.type} | ${def} |`;
        }).join('\n');
        return `${text}\n\n`;
    }

    toMarkdown() {
        let md = `# ${this._name} API\n\n`;
        md += this._createTable('props');
        md += this._createTable('events');
        md += this._createTable('slots');
        md += this._createTable('scopedSlots');
        return md;
    }
}

// 解析
const parsers = Object.keys(modules).map(name => {
    const file = modules[name];
    const fp = path.join(ROOT, file);
    return {
        fp, name, file,
    };
}).map(({ fp, name, file }) => {
    if (fs.existsSync(fp)) {
        // 1、存在, 开始读取文件内容, 并进行分析
        const buffer = fs.readFileSync(fp);
        const content = buffer.toString();
        return new ParserVue(content, name, file, fp);
    }
    return null;
})
    .filter(parser => !!parser)
    .map(parser => {
        const results = parser.run();
        return results;
    })
    .filter(parser => parser && !parser.isEmpty());

// 对文件夹进行合并,
const parserMap = parsers.reduce((obj, parser) => {
    const key = parser._dirname;
    if (!obj[key]) {
        obj[key] = [];
    }
    obj[key].push(parser);
    return obj;
}, {});

// 输出 md
console.log(Colors.blue('\n\n ### Create API Markdown Start ### \n'));
Object.keys(parserMap).forEach(key => {
    const parsers = parserMap[key];
    for (const i in parsers) {
        const parser = parsers[i];
        doWriteFile(parser);
    }
});

function doWriteFile(parser) {
    const name = parser._name;
    const root = parser._root;

    const dist = path.join(root, `./${name}API.md`);
    const md = parser.toMarkdown();

    console.log(`${name.green} --> ${dist.grey}`);
    fs.writeFileSync(dist, md);
}

console.log(Colors.blue('\n ### Create API Markdown End ### \n\n'));
