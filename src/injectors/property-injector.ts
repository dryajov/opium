'use strict'

import { Injector } from '../injector'
import { Dependency } from '../dependency'

import Debug from 'debug'
const debug = Debug('opium:property-injector')

/**
 * This class will perform property injection, by matching
 * dependency names to property names. The property is expected
 * to be defined and set to null, otherwise no injection is performed.
 */
export class PropertyInjector extends Injector {
  /**
   * Inject the dependency by calling dependency['property name'] = dep1;
   *
   * @param {Dependency} dep
   * @returns {*}
   */
  async inject (dep: Dependency) {
    let allDeps = await super.inject(dep)

    if (!allDeps) {
      dep.injected = Promise.resolve(dep.target)
      return dep.target
    }

    for (const depDep of allDeps) {
      if (!depDep) {
        debug(`Dependency ${String(dep.name)} doesn't exist!`)
        return
      }

      if (typeof dep.target[depDep.name] === 'undefined') {
        debug(`Property ${String(depDep.name)} undefined in dependency ${String(dep.name)}`)
        return
      }

      if (dep.target[depDep.name]) {
        debug(`Property ${String(depDep.name)} not null in dependency ${String(dep.name)}`)
      }

      dep.target[depDep.name] = await depDep.injected // set property
    }

    return dep.target
  }
}
