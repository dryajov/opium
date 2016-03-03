/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _injector = require('../injector');

var _injector2 = _interopRequireDefault(_injector);

/**
 * This class will perform constructor injection, by instantiating
 * the passed in dependency and passing in its deps as constructor
 * arguments. Dependency is expected to be a constructor function,
 * or an ES6+ class.
 */

var ConstructorInjector = (function (_Injector) {
    _inherits(ConstructorInjector, _Injector);

    function ConstructorInjector() {
        _classCallCheck(this, ConstructorInjector);

        _get(Object.getPrototypeOf(ConstructorInjector.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ConstructorInjector, [{
        key: 'inject',

        /**
         * Inject the dependency by calling class Reflect.construct(dependency, arguments)
         *
         * @param dep
         * @returns {*}
         */
        value: function inject(dep) {
            var allDeps = _get(Object.getPrototypeOf(ConstructorInjector.prototype), 'inject', this).call(this, dep);
            var args = allDeps ? allDeps.map(function (d) {
                return d.injected;
            }) : null;

            if (dep.args) {
                args = args.concat(dep.args) || dep.args;
            }

            // inject as constructor params
            return this._newCall(dep.dep, args);
        }
    }, {
        key: '_newCall',
        value: function _newCall(Clazz, args) {
            /*jshint -W058 */
            return Reflect.construct(Clazz, args);
        }
    }]);

    return ConstructorInjector;
})(_injector2['default']);

exports['default'] = ConstructorInjector;
module.exports = exports['default'];
//# sourceMappingURL=constructor-injector.js.map
