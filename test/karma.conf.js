'use strict'

module.exports = function (karma) {
  karma.set({

    frameworks: ['jasmine', 'browserify'],

    files: [
      '../.tmp/test/specs.js'
    ],

    reporters: ['dots'],

    preprocessors: {
      'test/*.spec.js': ['babel']
    },

    browsers: ['Chrome', 'Firefox'],

    logLevel: 'DEBUG',

    singleRun: true,
    autoWatch: false,

    // browserify configuration
    browserify: {
      debug: true,
      transform: ['browserify-shim']
    }
  })
}
