/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

import Injector from '../injector'

/**
 * This class will perform argument injection by calling
 * apply on the registered dependency. It expects dependency to be
 * a function.
 */
export default class ArgumentInjector extends Injector {
  /**
   * Inject de dependency by calling dependency.apply(dependency, arguments)
   *
   * @param dep
   * @returns {*}
   */
  inject (dep) {
    let allDeps = super.inject(dep)
    let args = allDeps ? allDeps.map((d) => d.injected) : null

    if (dep.args) {
      args = args.concat(dep.args) || dep.args
    }

    // inject as parameters
    return dep.dep.apply(dep.dep, args)
  }
}
