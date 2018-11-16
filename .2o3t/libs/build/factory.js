// 生成 compoents 的 index.js 文件
const fs = require('fs');
const Colors = require('colors');

export default function autoLoad(base, modules) {

    console.log(Colors.grey(`Auto Load <${base.underline}>`));

    fs.writeFileSync(`${base}/index.js`,
        `/* auto load */
${Object.keys(modules).map(name => {
        return `import ${name} from '${modules[name]}';`;
    }).join('\n')}

export default {

    ${Object.keys(modules).map(name => {
        return `${name},`;
    }).join('\n')}

    };
`
    );

}
