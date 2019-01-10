'use strict';

const Commonjs  = require('rollup-plugin-commonjs');
const Babel  = require('rollup-plugin-babel');
const { uglify }  = require('rollup-plugin-uglify');

const env = process.env.NODE_ENV;
const config = {
    input: './lib/transformer.js',
    output: {
        file: 'dist/optimus.min.js',
        format: 'iife',
        name: 'Optimus',
        exports: 'named',
        sourcemap: true
    },
    plugins: [
        Commonjs(),
        Babel({
            presets: [
                ['@babel/preset-env', {
                    debug: process.env.NODE_ENV !== 'production'
                }]
            ],
            exclude: 'node_modules/**'
        })
    ]
};

if (env === 'production') {
    config.plugins.push(
        uglify({
            warnings: true,
            sourcemap: true
        })
    );
}

module.exports = config;
