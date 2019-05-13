import { LifeCycle } from './consts'
import { Injector } from './injector'

import Debug from 'debug'
const debug = Debug('opium:dependency')

/**
 * A Dependency wraps any real dependency (thingy) and provides the facilities
 * require to perform DI on it. Whenever one of the register* methods is called
 * to register a dependency with Opium, it will be wrapped in this object, subsequent
 * calls to the inject method on it, will trigger the injection cycle.
 */
export class Dependency {
  public name: string
  public dep: any
  public registry: Map<string, Dependency>
  public injector: Injector
  public lifeCycle: LifeCycle
  public args: any[] = []

  public deps: string[]
  public injected: any | Promise<any>
  public hasInjected: boolean = false

  /**
   * Construct a dependency
   *
   * @param {any} name  - Name of the dependency
   * @param {any} dep - The dependency to be wrapped
   * @param {array} deps - An array of dependency names
   * @param {map} registry - The global dep registry
   * @param {Injector} injector  - The injector to be used
   * @param {PROTOTYPE|SINGLETON} lifeCycle  - The life cycle of the dependency
   * @param {array} args  - The arguments to pass as is, to constructors and factories
   */
  constructor (
    name: any,
    dep: any,
    deps: any[],
    registry: Map<any, Dependency>,
    injector: Injector,
    lifeCycle: LifeCycle = LifeCycle.SINGLETON,
    ...args: any[]) {

    this.name = name
    this.dep = dep
    this.registry = registry
    this.injector = injector
    this.lifeCycle = lifeCycle
    this.args = args

    this.deps = Array.isArray(deps) ? deps : [deps]
    if (this.deps.filter((depName) => this.name === depName).length) {
      throw new Error(`Can't inject ${this.name} into ${this.name}`)
    }
  }

  /**
   * Perform the injection cycle according to the current dep lifecycle
   *
   * @returns {Dependency.injected|*} - Returns the resolved dependency object (this)
   */
  async injectDeps () {
    if (this.lifeCycle === LifeCycle.PROTOTYPE || !this.hasInjected) {
      // if injected is a promise, then we're still in the process
      // of resolving this dependency, don't try injecting again until
      // it resolves
      if (this.injected && typeof this.injected.then === 'function') {
        return this
      }

      try {
        this.injected = this.injector.inject(this).catch((err) => {
          debug(err)
          return Promise.reject(err)
        })
      } catch (e) {
        return Promise.reject(e)
      }
    }

    return this
  }

  /**
   * Perform the injection cycle according to the current dep lifecycle
   *
   * @returns {Dependency.injected|*} - Returns the resolved dependency value
   */
  async inject () {
    if (this.injected && typeof this.injected.then === 'function') {
      throw new Error(`Dependency has not finished resolving, make sure to await the inject method!`)
    }

    if (this.lifeCycle === LifeCycle.PROTOTYPE) {
      // cleanup after ourself, this should be fine,
      // since inject should be called serially
      this.resolve().forEach((d?: Dependency) => {
        if (d && d.lifeCycle === LifeCycle.PROTOTYPE) d.injected = null
      })

      this.injected = null
    }

    await this.injectDeps()
    this.injected = await this.injected
    this.hasInjected = true
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
