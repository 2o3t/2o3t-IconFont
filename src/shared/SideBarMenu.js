const KEY_MAP = {
    0: 'DEFAULT',
    1: 'Design Specifications',
    2: 'Basic',
    3: 'General',
    4: 'Navigation',
    5: 'Form',
    6: 'Data Display',
    7: 'Feedback',
};

export default function(modules, keyMap = KEY_MAP) {
    const others = [];
    const sides = modules.reduce((obj, { key, name, label, router }) => {
        // 1-2-3-name
        // 1-2-name
        const arrs = key.split('-');
        const title = keyMap[arrs[0]];
        if (title) {
            if (!obj[title]) {
                obj[title] = [];
            }
            obj[title].push({
                name, router, label,
            });
        } else {
            others.push({
                name, router, label,
            });
        }
        return obj;
    }, {});

    const result = {};

    Object.assign(result, sides);

    if (others.length) {
        result.OTHERS = others;
    }

    return result;
}
