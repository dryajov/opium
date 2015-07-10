'use strict';

module.exports = function (karma) {
    karma.set({

        frameworks: ['jasmine', 'browserify'],

        files: [
            '../.tmp/test/specs.js',
            '../node_modules/karma-babel-preprocessor/node_modules/babel-core/browser-polyfill.js'
        ],

        reporters: ['dots'],

        preprocessors: {
            'test/**/*Spec.js': ['babel']
        },

        browsers: ['Chrome'],

        logLevel: 'LOG_DEBUG',

        singleRun: false,
        autoWatch: false,

        // browserify configuration
        browserify: {
            debug: true,
            transform: ['browserify-shim']
        }
    });
};
