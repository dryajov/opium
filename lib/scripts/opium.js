/*jshint unused:false*/

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('babel/polyfill');

var _dependency = require('./dependency');

var _dependency2 = _interopRequireDefault(_dependency);

var _injectorsPropertyInjector = require('./injectors/property-injector');

var _injectorsPropertyInjector2 = _interopRequireDefault(_injectorsPropertyInjector);

var _injectorsConstructorInjector = require('./injectors/constructor-injector');

var _injectorsConstructorInjector2 = _interopRequireDefault(_injectorsConstructorInjector);

var _injectorsArgumentInjector = require('./injectors/argument-injector');

var _injectorsArgumentInjector2 = _interopRequireDefault(_injectorsArgumentInjector);

var _consts = require('./consts');

var Opium = (function () {
    function Opium() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? 'default' : arguments[0];
        var lifeCycle = arguments.length <= 1 || arguments[1] === undefined ? _consts.SINGLETON : arguments[1];

        _classCallCheck(this, Opium);

        this.name = name;
        this.registry = new Map();
        this.lifeCycle = lifeCycle;
    }

    _createClass(Opium, [{
        key: 'getDep',

        /**
         * Ge dependency by name
         *
         * @param name
         * @returns {*}
         */
        value: function getDep(name) {
            return this.registry.get(name);
        }

        /**
         * Register a type. By default, type dependencies use constructor injection.
         *
         * @param name - Name to register this dependency with
         * @param type - The type that this dependency is going to be registered with
         * @param deps - An array of dependencies to be resolved before this dependency is created
         * @param lifecycle - Lifecycle of this dependency
         * @param args - An array of addition arguments to be passed as is to the constructor of the type
         */
    }, {
        key: 'registerType',
        value: function registerType(name, type) {
            var deps = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var lifecycle = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
            var args = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

            this.register(name, type, deps, new _injectorsConstructorInjector2['default'](), lifecycle || this.defaultLifecycle);
        }

        /**
         * Register a factory. By default, factory dependencies use argument injection.
         *
         * @param name - Name to register this dependency with
         * @param factory - The factory that will be used to create the dependency
         * @param deps - An array of dependencies to be resolved before this factory is called
         * @param lifecycle - Lifecycle of this dependency
         * @param args - An array of addition arguments to be passed as is to the factory function
         */
    }, {
        key: 'registerFactory',
        value: function registerFactory(name, factory) {
            var deps = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var lifecycle = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
            var args = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

            this.register(name, factory, deps, new _injectorsArgumentInjector2['default'](), lifecycle || this.defaultLifecycle);
        }

        /**
         * Register an instance (a concrete object). By default, instance dependencies use property/setter injection.
         *
         * @param name - Name to register this dependency with
         * @param instance - The instance to register
         * @param deps - An array of dependencies to be resolved before this factory is called
         * @param lifecycle - Lifecycle of this dependency
         */
    }, {
        key: 'registerInstance',
        value: function registerInstance(name, instance) {
            var deps = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var lifecycle = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            this.register(name, instance, deps, new _injectorsPropertyInjector2['default'](), lifecycle || this.defaultLifecycle);
        }

        /**
         * Register a dependency. This is called by registerType, registerFactory and registerInstance underneath to register
         * dependencies.
         *
         * @param name - Name of the dependency
         * @param dep - The dependency. Can be a type, factory or instance.
         * @param deps - An array of dependencies to be resolved before this dependency is injected.
         * @param injector - The injector to be used in order to perform the injection of the dependencies.
         * @param lifecycle - The lifecycle for this dependency {SINGLETON, PROTOTYPE}
         * @param args - An array of addition arguments to be passed as is to the dependency.
         *                NOTE: Only applies to constructor or argument injectors
         */
    }, {
        key: 'register',
        value: function register(name, dep, deps, injector, lifecycle, args) {
            this.registry.set(name, new _dependency2['default'](name, dep, deps, this.registry, injector, lifecycle, args));
        }

        /**
         * Remove dependency from the registry
         *
         * @param name
         * @returns {*}
         */
    }, {
        key: 'unRegister',
        value: function unRegister(name) {
            var dep = undefined;
            if (dep = this.registry.get(name)) {
                this.registry['delete'](name);
            }

            return dep;
        }

        /**
         * Inject all dependencies
         */
    }, {
        key: 'inject',
        value: function inject() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.registry.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dep = _step.value;

                    dep.inject(); // inject all dependencies
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: 'defaultLifecycle',
        get: function get() {
            return this.lifeCycle;
        },
        set: function set(val) {
            this.lifeCycle = val;
        }
    }]);

    return Opium;
})();

exports['default'] = Opium;
module.exports = exports['default'];
//# sourceMappingURL=opium.js.map
