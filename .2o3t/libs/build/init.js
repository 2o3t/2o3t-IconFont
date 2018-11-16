import config from './config';

import rollupConfig from './rollupConfig';

export default function(options) {

    Object.assign(config, options);

    import('./createAPI');

    import('./components');

    import('./directives');

    import('./service');

    // import('./test');
    return rollupConfig;
}
