'use strict'

import { Injector } from '../injector'
import { Dependency } from '../dependency'

/**
 * This class will perform argument injection by calling
 * apply on the registered dependency. It expects dependency to be
 * a function.
 */
export class ArgumentInjector extends Injector {
  /**
   * Inject de dependency by calling dependency.apply(dependency, arguments)
   *
   * @param {Dependency} dep
   * @returns {*}
   */
  async inject (dep: Dependency) {
    const _deps = await super.inject(dep)
    let args: any[] = await (_deps ? Promise.all(_deps.map((d) => d && d.injected)) : [])

    if (dep.args) {
      args = await Promise.all((args.concat(...dep.args) || dep.args))
    }

    // inject as parameters
    return dep.target.apply(dep.target, args)
  }
}
