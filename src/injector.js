/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

/**
 * This class serves as a base class for all injector types.
 * Extend it to create a new injector type.
 */
export default class Injector {
  /**
   * Inject a dependency. This method will call inject on all
   * dependencies that it resolves from dep. This method is cascading,
   * calling it, will cause the dependency graph for you dependency to be
   * resolved.
   *
   * @param dep - the dependency to be injected
   * @returns {*}
   */
  inject (dep) {
    var allDeps = dep.resolve()
    if (allDeps.length <= 0) {
      return
    }

    allDeps.forEach((depDep) => depDep.inject())
    return allDeps
  }
}
