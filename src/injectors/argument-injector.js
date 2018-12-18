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
    const _deps = super.inject(dep)
    const allDeps = await (Array.isArray(_deps) ? Promise.all(_deps) : _deps)
    let args = allDeps ? allDeps.map((d) => d.injected) : []

    if (dep.args) {
      args = args.concat(dep.args) || dep.args
    }

    // inject as parameters
    const deps = await dep.dep.apply(dep.dep, args)
    return deps
  }
}

module.exports = ArgumentInjector
