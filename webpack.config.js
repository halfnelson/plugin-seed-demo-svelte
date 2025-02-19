const webpack = require('@nativescript/webpack');
const fs = require('fs');
const { resolve } = require('path');

let snippetConfig;
if (fs.existsSync('../demo-snippets/webpack.config.svelte.js')) {
    snippetConfig = require('../demo-snippets/webpack.config.svelte.js');
}
module.exports = (env) => {
    if (fs.existsSync('../demo-snippets/assets')) {
        webpack.Utils.addCopyRule({
            from: '../demo-snippets/assets',
            to: '.'
        });
    }
    webpack.init(env);

    const { redirect } = env;

    if (snippetConfig) {
        snippetConfig(env, webpack);
    }

    webpack.chainWebpack((config) => {
        config.resolve.modules.add(resolve(__dirname, '../demo-snippets/node_modules'));
        config.plugin('DefinePlugin').tap((args) => {
            if (redirect) {
                Object.assign(args[0], {
                    demoRedirect: JSON.stringify(redirect)
                });
            } else {
                Object.assign(args[0], {
                    demoRedirect: JSON.stringify('')
                });
            }
            return args;
        });
    });

    return webpack.resolveConfig();
};
