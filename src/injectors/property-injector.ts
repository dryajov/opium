'use strict'

import { Injector } from '../injector'
import _debug = require('debug')
import { Dependency } from '../dependency'
const debug = _debug('opium:property-injector')

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
      dep.injected = Promise.resolve(dep.dep)
      return dep.dep
    }

    for (const depDep of allDeps) {
      if (!depDep) {
        debug(`Dependency ${dep.name} doesn't exist!`)
        return
      }

      if (typeof dep.dep[depDep.name] === 'undefined') {
        debug(`Property ${depDep.name} undefined in dependency ${dep.name}`)
        return
      }

      if (dep.dep[depDep.name]) {
        debug(`Property ${depDep.name} not null in dependency ${dep.name}`)
      }

      dep.dep[depDep.name] = await depDep.injected // set property
    }

    return dep.dep
  }
}
