import Debug from 'debug'
import { Dependency } from './dependency'

const debug = Debug('opium:injector')

/**
 * This class serves as a base class for all injector types.
 * Extend it to create a new injector type.
 */
export class Injector {
  /**
   * Inject a dependency. This method will call inject on all
   * dependencies that it resolves from dep. This method is cascading,
   * calling it, will cause the dependency graph for you dependency to be
   * resolved.
   *
   * @param {Dependency} dep - the dependency to be injected
   * @returns {*}
   */
  async inject (dep: Dependency) {
    const _deps = dep.resolve()
    let allDeps = await (Array.isArray(_deps) ? Promise.all(_deps) : _deps)

    if (allDeps.length <= 0) {
      return
    }

    try {
      allDeps = await Promise.all(allDeps.map((_dep, i) => {
        if (!_dep) {
          throw new Error(`no dependency with name "${dep.deps[i]}" found!
        Has it been previously registered with one of the register* methods?`)
        }

        return _dep.injectDeps()
      }))
    } catch (e) {
      return Promise.reject(e)
    }

    debug('injecting dependencies for %s', dep.name)
    return allDeps
  }
}
