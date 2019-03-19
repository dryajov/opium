'use strict'

const Injector = require('../injector')

/**
 * This class will perform constructor injection, by instantiating
 * the passed in dependency and passing in its deps as constructor
 * arguments. Dependency is expected to be a constructor function,
 * or an ES6+ class.
 */
class ConstructorInjector extends Injector {
  /**
   * Inject the dependency by calling `new dep(...args)`
   *
   * @param {Dependency} dep
   * @returns {*}
   */
  async inject (dep) {
    const _deps = await super.inject(dep)
    let args = await (_deps ? Promise.all(_deps.map((d) => d && d.injected)) : [])

    if (dep.args) {
      args = await Promise.all(args.concat(dep.args) || dep.args)
    }

    // inject as constructor params
    return this._newCall(dep.dep, args)
  }

  _newCall (Clazz, args) {
    return new Clazz(...args)
  }
}

module.exports = ConstructorInjector
