/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

/**
 * This class serves as a base class for all injector types.
 * Extend it to create a new injector type.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Injector = (function () {
  function Injector() {
    _classCallCheck(this, Injector);
  }

  _createClass(Injector, [{
    key: "inject",

    /**
     * Inject a dependency. This method will call inject on all
     * dependencies that it resolves from dep. This method is cascading,
     * calling it, will cause the dependency graph for you dependency to be
     * resolved.
     *
     * @param dep - the dependency to be injected
     * @returns {*}
     */
    value: function inject(dep) {
      var allDeps = dep.resolve();
      if (!allDeps.length) {
        return;
      }

      allDeps.forEach(function (depDep) {
        return depDep.inject();
      });
      return allDeps;
    }
  }]);

  return Injector;
})();

exports["default"] = Injector;
module.exports = exports["default"];
//# sourceMappingURL=../scripts/injector.js.map