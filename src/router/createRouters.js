export default function(modules, callback) {
    const DIRNAME = modules.DIRNAME || 'DEFAULT';
    const routes = [];

    if (process.env.NODE_ENV !== 'production') {
        const result = {
            path: `/${DIRNAME}/Uncategorized`,
            name: `${DIRNAME}_Uncategorized-page`,
            _name: 'Uncategorized-page',
            index: '',
            key: '0-0',
            label: 'Uncategorized 未分类',
            router: `/${DIRNAME}/Uncategorized`,
        };
        if (callback) {
            result.components = callback();
        }
        routes.push(result);
    }

    return routes.concat(modules.map(item => {
        const result = {
            name: `${DIRNAME}_${item.name}`,
            path: item.router,

            _name: item.name,
            index: item.index,
            key: item.key,
            label: item.label,
            router: item.router,
        };
        if (callback) {
            result.components = callback(item.index);
        }
        return result;
    }));
}
