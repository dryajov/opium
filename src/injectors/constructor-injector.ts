'use strict'

import { Injector } from '../injector'
import { Dependency } from '../dependency'

/**
 * This class will perform constructor injection, by instantiating
 * the passed in dependency and passing in its deps as constructor
 * arguments. Dependency is expected to be a constructor function,
 * or an ES6+ class.
 */
export class ConstructorInjector extends Injector {
  /**
   * Inject the dependency by calling `new dep(...args)`
   *
   * @param {Dependency} dep
   * @returns {*}
   */
  async inject (dep: Dependency) {
    const _deps = await super.inject(dep)
    let args: any[] = await (_deps ? Promise.all(_deps.map((d) => d && d.injected)) : [])

    if (dep.args) {
      args = await Promise.all(args.concat(dep.args) || dep.args)
    }

    // inject as constructor params
    return Reflect.construct(dep.target, args)
  }
}
