/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _consts = require('./consts');

/**
 * A Dependency wraps any real dependency (thingy) and provides the facilities
 * require to perform DI on it. Whenever one of the register* methods is called
 * to register a dependency with Opium, it will be wrapped in this object, subsequent
 * calls to the inject method on it, will trigger the injection cycle.
 */

var Dependency = (function () {

    /**
     * Construct a dependency
     *
     * @param name - Name of the dependency
     * @param dep - The dependency to be wrapped
     * @param deps - An array of dependency names
     * @param registry - The global dep registry
     * @param injector - The injector to be used
     * @param lifecycle - The lifecycle of the depepndency
     */

    function Dependency(name, dep, deps, registry, injector, lifecycle) {
        var _this = this;

        _classCallCheck(this, Dependency);

        this.name = name;
        this.dep = dep;
        this.registry = registry;
        this.injector = injector;
        this.lifecycle = lifecycle;

        this.deps = deps;
        this.injected = null;

        if (this.deps && this.deps.filter(function (depName) {
            return _this.name === depName;
        }).length) {
            throw new Error('Can\'t inject ' + this.name + ' into ' + this.name);
        }
    }

    /**
     * Perform the injection cycle according to the current dep lifecycle
     *
     * @returns {Dependency.injected|*} - Returns the result of performing the injection cycle
     */

    _createClass(Dependency, [{
        key: 'inject',
        value: function inject() {
            if (!this.injected || this.lifecycle === _consts.PROTOTYPE) {
                this.injected = this.injector.inject(this) || this.dep;
            }

            return this.injected;
        }

        /**
         * Get an array of dependencies that this Dependency expects
         *
         * @returns {Array}
         */
    }, {
        key: 'resolve',
        value: function resolve() {
            var dependencies = [];
            if (this.deps) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.deps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _name = _step.value;

                        dependencies.push(this.registry.get(_name));
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

            return dependencies;
        }
    }]);

    return Dependency;
})();

exports['default'] = Dependency;
module.exports = exports['default'];
//# sourceMappingURL=../scripts/dependency.js.map