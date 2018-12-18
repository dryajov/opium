'use strict'

const Injector = require('../injector')

const debug = require('debug')('property-injector')

/**
 * This class will perform property injection, by matching
 * dependency names to property names. The property is expected
 * to be defined and set to null, otherwise no injection is performed.
 */
class PropertyInjector extends Injector {
  /**
   * Inject the dependency by calling dependency['property name'] = dep1;
   *
   * @param {Dependency} dep
   * @returns {dep|*|Dependency.dep}
   */
  async inject (dep) {
    const allDeps = await super.inject(dep)

    if (!allDeps) {
      return dep.dep
    }

    allDeps.forEach((depDep) => {
      if (typeof dep.dep[depDep.name] === 'undefined') {
        debug(`Property ${depDep.name} undefined in dependency ${dep.name}`)
        return
      }

      if (dep.dep[depDep.name]) {
        debug(`Property ${depDep.name} not null in dependency ${dep.name}`)
      }

      dep.dep[depDep.name] = depDep.injected // set property
    })

    return dep.dep
  }
}

module.exports = PropertyInjector
