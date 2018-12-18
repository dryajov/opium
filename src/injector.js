'use strict'

/**
 * This class serves as a base class for all injector types.
 * Extend it to create a new injector type.
 */
class Injector {
  /**
   * Inject a dependency. This method will call inject on all
   * dependencies that it resolves from dep. This method is cascading,
   * calling it, will cause the dependency graph for you dependency to be
   * resolved.
   *
   * @param {Dependency} dep - the dependency to be injected
   * @returns {*}
   */
  async inject (dep) {
    const _deps = dep.resolve()
    let allDeps = await (Array.isArray(_deps) ? Promise.all(_deps) : _deps)

    if (allDeps.length <= 0) {
      return
    }

    allDeps = await Promise.all(allDeps.map((dep) => dep.injectDeps()))
    return allDeps
  }
}

module.exports = Injector
