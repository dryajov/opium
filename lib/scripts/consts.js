/**
 * Created by dmitriy.ryajov on 7/1/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

require('babel-polyfill');

// Lifecycle
var SINGLETON = 0;
exports.SINGLETON = SINGLETON;
var PROTOTYPE = 1;

exports.PROTOTYPE = PROTOTYPE;
// Resolver cycle
var TYPE = 0;
exports.TYPE = TYPE;
var FACTORY = 1;
exports.FACTORY = FACTORY;
var INSTANCE = 2;
exports.INSTANCE = INSTANCE;
//# sourceMappingURL=consts.js.map
