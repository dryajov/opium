'use strict';

module.exports = function (karma) {
    karma.set({

        frameworks: ['jasmine', 'browserify'],

        files: [
            '../.tmp/test/specs.js'
        ],

        reporters: ['dots'],

        preprocessors: {
            'test/**/*Spec.js': ['babel']
        },

        browsers: ['PhantomJS'],

        logLevel: 'LOG_DEBUG',

        singleRun: true,
        autoWatch: true,

        // browserify configuration
        browserify: {
            debug: true,
            transform: ['browserify-shim']
        }
    });
};
