'use strict'

const Injector = require('../injector')

/**
 * This class will perform argument injection by calling
 * apply on the registered dependency. It expects dependency to be
 * a function.
 */
class ArgumentInjector extends Injector {
  /**
   * Inject de dependency by calling dependency.apply(dependency, arguments)
   *
   * @param {Dependency} dep
   * @returns {*}
   */
  async inject (dep) {
    const _deps = await super.inject(dep)
    let args = await (_deps ? Promise.all(_deps.map((d) => d && d.injected)) : [])

    if (dep.args) {
      args = await Promise.all((args.concat(dep.args) || dep.args))
    }

    // inject as parameters
    return dep.dep.apply(dep.dep, args)
  }
}

module.exports = ArgumentInjector
