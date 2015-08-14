/**
 * Created by dmitriy.ryajov on 7/17/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _consts = require('../consts');

/**
 * A resolver is an abstract helper class that allows specifying your own wiring logic.
 * For example, you might want to have a JSON or an XML document describe how dependencies
 * are wired, and bypass the programmatic API altogether.
 *
 * There are two phases, register and resolve.
 *
 * By default, register maps a register* method to a type of dependency.
 * The dependency types are - TYPE, FACTORY, INSTANCE and are looked up in the option's object type
 * property that is passed to register. Register will call resolve just before performing
 * registration of the dependency, and it expects an array of dependency names to be returned by it.
 *
 * This model should be flexible enough to allow writing resolvers for different needs ans scenarios.
 * The api has been intentionally left open to allow extensibility, and cater to as many different needs
 * as possible. However, this is not considered a core part of the framework, and is provided for convenience
 * mostly. Consider defining your own set of resolvers if this does not fit into your existing model, or using
 * the programmatic API directly.
 */

var Resolver = (function () {

    /**
     * Construct a resolver
     *
     * @param injector - an instance of opium-ioc compatible object
     */

    function Resolver(injector) {
        _classCallCheck(this, Resolver);

        this.injector = injector;
    }

    /**
     * Register a dependency
     *
     * @param name - dependency name
     * @param dep - the dependency to be registered
     * @param options - options object, by default expects type=[TYPE|FACTORY|INSTANCE]
     *                  and lifecycle=[SINGLETON|PROTOTYPE] to be defined. Both are defaulted
     *                  to INSTANCE and SINGLETON respectively.
     */

    _createClass(Resolver, [{
        key: 'register',
        value: function register(name, dep) {
            var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var deps = this.resolve(dep);
            var type = options.type || _consts.INSTANCE;
            var lifecycle = options.lifecycle || _consts.SINGLETON;
            if (deps) {
                switch (type) {
                    case _consts.TYPE:
                        {
                            this.injector.registerType(name, dep, deps, lifecycle);
                            break;
                        }

                    case _consts.FACTORY:
                        {
                            this.injector.registerFactory(name, dep, deps, lifecycle);
                            break;
                        }

                    case _consts.INSTANCE:
                        {
                            this.injector.registerInstance(name, dep, deps, lifecycle);
                            break;
                        }

                    default:
                        throw 'Unknown type ' + type;

                }
            }
        }

        /**
         * Resolve dependency names from the passed in dependency. By default, its called
         * right before registering a dependency by the register method.
         *
         * @param dep
         */
    }, {
        key: 'resolve',
        value: function resolve(dep) {
            throw 'method unimplemented!';
        }
    }]);

    return Resolver;
})();

exports['default'] = Resolver;
module.exports = exports['default'];
//# sourceMappingURL=../../scripts/resolvers/resolver.js.map