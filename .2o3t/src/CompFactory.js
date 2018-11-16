
const requireModules = files => {
    const modules = {};

    files.keys().sort((key1, key2) => {
        try {
            const name1 = key1.replace(/(\.\/|\.vue)/g, '');
            const a = /^([\d_-]+)/g.exec(name1)[1];
            const name2 = key2.replace(/(\.\/|\.vue)/g, '');
            const b = /^([\d_-]+)/g.exec(name2)[1];
            if (a && b) {
                return parseInt(a) - parseInt(b);
            }
        } catch (error) {
            console.error(`Key1: ${key1}`, `Key2: ${key2}`, error);
        }
        return 1;
    }).forEach(key => {
        if (/Index\.vue/img.test(key)) return;
        let file = files(key);
        if (file.__esModule === true) {
            if (file.default) {
                file = file.default;
            }
        }
        const name = key.replace(/(\.\/|\.vue)/g, '').replace(/^[\d_-]+/g, '');
        modules[`OT-${name}`] = file;
    });

    return modules;
};

/**
 * 创建 API 表格
 * @param {Html} api table
 * @return {String} html
 */
function createAPI(api) {
    const desc = '以下是大部分功能API, 删除代表 ‘过时’ 或 ‘未实现’,  ‘@’ 开头表示是Event事件.';
    return `<ot-section :theme="$otTheme" :level="2" label="API" desc="${desc}" prefix="#">
    ${api}
    </ot-section>`;
}

const getTemplate = (config, modules) => {
    const LABEL = config.LABEL;
    const DESC = config.DESC;
    const COMPONENTS = config.COMPONENTS || {};
    const bMd = COMPONENTS.__markdown;
    // api
    const API = config._API_;

    const template = `
    <ot-section :theme="$otTheme" :level="2" label="${LABEL}" desc="${DESC}">
${
    Object.keys(modules).map(key => {
        const name = key.replace(/^OT-/igm, '');
        const comp = COMPONENTS[name] || {};
        if (bMd) {
            return `<${key} :theme="$otTheme" label="${comp.LABEL || ''}" descHtml='${(comp.DESC || '').replace(/'/igm, '"')}' prefix="#"/>`;
        }
        return `<${key} :theme="$otTheme" label="${comp.LABEL || ''}" desc="${comp.DESC || ''}" prefix="#"/>`;
    }).join('\n')
}
${
    API ? createAPI(API) : ''
}
    </ot-section>
    `;
    return template;
};

export default {
    requireModules,
    getTemplate,
};
