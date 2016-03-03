/**
 * Created by dmitriy.ryajov on 7/17/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var PropResolver = (function (_Resolver) {
    _inherits(PropResolver, _Resolver);

    /**
     * Construct property resolver
     *
     * @param injector - Injector instance to be used
     * @param propName - Property name
     */

    function PropResolver(injector) {
        var propName = arguments.length <= 1 || arguments[1] === undefined ? '$inject' : arguments[1];

        _classCallCheck(this, PropResolver);

        _get(Object.getPrototypeOf(PropResolver.prototype), 'constructor', this).call(this, injector);

        this.propName = propName;
    }

    /**
     * Resolve dependency names
     *
     * @param obj - Object to resolve property for
     * @returns {*}
     */

    _createClass(PropResolver, [{
        key: 'resolve',
        value: function resolve(obj) {
            if (!(this.propName in obj)) {
                console.info('Undefined object or no injector property "' + this.propName + '" found!');
                return;
            }

            return obj[this.propName];
        }
    }]);

    return PropResolver;
})(_resolver2['default']);

exports['default'] = PropResolver;
module.exports = exports['default'];
//# sourceMappingURL=property-resolver.js.map
