/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

import { PROTOTYPE } from './consts'

/**
 * A Dependency wraps any real dependency (thingy) and provides the facilities
 * require to perform DI on it. Whenever one of the register* methods is called
 * to register a dependency with Opium, it will be wrapped in this object, subsequent
 * calls to the inject method on it, will trigger the injection cycle.
 */
export default class Dependency {
  /**
   * Construct a dependency
   *
   * @param name - Name of the dependency
   * @param dep - The dependency to be wrapped
   * @param deps - An array of dependency names
   * @param registry - The global dep registry
   * @param injector - The injector to be used
   * @param lifecycle - The lifecycle of the depepndency
   * @param args - The arguments to pass as is, to constructors and factories
   */
  constructor (name, dep, deps, registry, injector, lifecycle, args) {
    this.name = name
    this.dep = dep
    this.registry = registry
    this.injector = injector
    this.lifecycle = lifecycle
    this.args = args

    this.deps = deps
    this.injected = null
    this.hasInjected = false

    if (this.deps && this.deps.filter((depName) => {
      return this.name === depName
    }).length) {
      throw new Error(`Can't inject ${this.name} into ${this.name}`)
    }
  }

  /**
   * Perform the injection cycle according to the current dep lifecycle
   *
   * @returns {Dependency.injected|*} - Returns the result of performing the injection cycle
   */
  inject () {
    if (!this.hasInjected || this.lifecycle === PROTOTYPE) {
      this.injected = this.injector.inject(this)
      this.hasInjected = true
    }

    return this.injected
  }

  /**
   * Get an array of dependencies that this Dependency expects
   *
   * @returns {Array}
   */
  resolve () {
    let dependencies = []
    if (this.deps) {
      for (let name of this.deps) {
        dependencies.push(this.registry.get(name))
      }
    }

    return dependencies
  }
}
