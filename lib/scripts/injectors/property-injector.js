/**
 * Created by dmitriy.ryajov on 6/27/15.
 *
 * Default injector implements property injection
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _injector = require('../injector');

var _injector2 = _interopRequireDefault(_injector);

/**
 * This class will perform property injection, by matching
 * dependency names to property names. The property is expected
 * to be defined and set to null, otherwise no injection is performed.
 */

var PropertyInjector = (function (_Injector) {
  _inherits(PropertyInjector, _Injector);

  function PropertyInjector() {
    _classCallCheck(this, PropertyInjector);

    _get(Object.getPrototypeOf(PropertyInjector.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(PropertyInjector, [{
    key: 'inject',

    /**
     * Inject the dependency by calling dependency['property name'] = dep1;
     *
     * @param dep
     * @returns {dep|*|Dependency.dep}
     */
    value: function inject(dep) {
      var allDeps = _get(Object.getPrototypeOf(PropertyInjector.prototype), 'inject', this).call(this, dep);

      if (!allDeps) {
        return dep.dep;
      }

      allDeps.forEach(function (depDep) {
        if (typeof dep.dep[depDep.name] === 'undefined') {
          console.error('Property ' + depDep.name + ' undefined in dependency ' + dep.name);

          return;
        }

        if (dep.dep[depDep.name]) {
          console.warn('Property ' + depDep.name + ' not null in dependency ' + dep.name);
        }

        dep.dep[depDep.name] = depDep.injected; // set property
      });

      return dep.dep;
    }
  }]);

  return PropertyInjector;
})(_injector2['default']);

exports['default'] = PropertyInjector;
module.exports = exports['default'];
//# sourceMappingURL=property-injector.js.map
