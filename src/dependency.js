'use strict'

const debug = require('debug')('opium:dependency')

const { PROTOTYPE } = require('./consts')

/**
 * A Dependency wraps any real dependency (thingy) and provides the facilities
 * require to perform DI on it. Whenever one of the register* methods is called
 * to register a dependency with Opium, it will be wrapped in this object, subsequent
 * calls to the inject method on it, will trigger the injection cycle.
 */
class Dependency {
  /**
   * Construct a dependency
   *
   * @param {string} name  - Name of the dependency
   * @param {any} dep - The dependency to be wrapped
   * @param {array} deps - An array of dependency names
   * @param {map} registry - The global dep registry
   * @param {Injector} injector  - The injector to be used
   * @param {PROTOTYPE|SINGLETON} lifeCycle  - The life cycle of the dependency
   * @param {array} args  - The arguments to pass as is, to constructors and factories
   */
  constructor (name, dep, deps, registry, injector, lifeCycle, args) {
    this.name = name
    this.dep = dep
    this.registry = registry
    this.injector = injector
    this.lifecycle = lifeCycle
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
   * @returns {Dependency.injected|*} - Returns the resolved dependency object (this)
   */
  async injectDeps () {
    if (this.lifecycle === PROTOTYPE || !this.hasInjected) {
      this.injected = await this.injector.inject(this).catch(console.error)
      this.hasInjected = true
    }

    return this
  }

  /**
   * Perform the injection cycle according to the current dep lifecycle
   *
   * @returns {Dependency.injected|*} - Returns the resolved dependency value
   */
  async inject () {
    await this.injectDeps()
    return this.injected
  }

  /**
   * Get an array of dependencies that this Dependency expects
   *
   * @returns {Array}
   */
  resolve () {
    const deps = this.deps || []
    return deps.map((name) => this.registry.get(name))
  }
}

module.exports = Dependency
