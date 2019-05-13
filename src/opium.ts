'use strict'

import { Dependency } from './dependency'

import {
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector
} from './injectors'

import { LifeCycle } from './consts'
import { Injector } from './injector'

export class Opium {
  public name: string | Symbol
  public registry: Map<any, Dependency>
  public lifeCycle: LifeCycle = LifeCycle.SINGLETON

  /**
   * Construct an Opium IoC container
   *
   * @param {String|Symbol} name - name of the container
   * @param {LifeCycle} lifeCycle - default lifecycle of the dependencies
   */
  constructor (name: string | Symbol = 'opium', lifeCycle?: LifeCycle) {
    this.name = name
    this.registry = new Map()
    this.lifeCycle = lifeCycle || this.lifeCycle
  }

  /**
   * Ge dependency by name
   *
   * @param {string} name
   * @returns {*}
   */
  getDep (name: string | Symbol): Dependency {
    return this.registry.get(name) as Dependency
  }

  /**
   * Register a type. By default, type dependencies use constructor injection.
   *
   * @param {any} name - Name to register this dependency with
   * @param {any} type - The type that this dependency is going to be registered with
   * @param {array} deps - An array of dependencies to be resolved before this dependency is created
   * @param {SINGLETON|PROTOTYPE} lifeCycle - Life cycle of this dependency
   * @param {array} args - An array of addition arguments to be passed as is to the constructor of the type
   */
  registerType (name: any, deps?: any[]): void
  registerType (name: any, type: any, deps?: any[], ...args: any[]): void
  registerType (name: any, type: any = name, deps: any[] = [], lifeCycle: LifeCycle = LifeCycle.SINGLETON, ...args: any[]): void {
    if (Array.isArray(lifeCycle)) {
      args = lifeCycle
      lifeCycle = this.lifeCycle
    }

    this.register(name,
      type,
      deps,
      new ConstructorInjector(),
      lifeCycle || this.lifeCycle,
      args)
  }

  /**
   * Register a factory. By default, factory dependencies use argument injection.
   *
   * @param {string} name - Name to register this dependency with
   * @param {function} factory - The factory that will be used to create the dependency
   * @param {array} deps - An array of dependencies to be resolved before this factory is called
   * @param {SINGLETON|PROTOTYPE} lifeCycle - Life cycle of this dependency
   * @param {array} args - An array of addition arguments to be passed as is to the factory function
   */
  registerFactory (name: any, deps?: any[]): void
  registerFactory (name: any, factory: any, deps?: string[], ...args: any[]): void
  registerFactory (name: any, factory: any = name, deps: string[] = [], lifeCycle?: LifeCycle, ...args: any[]): void {
    if (Array.isArray(lifeCycle)) {
      args = lifeCycle
      lifeCycle = this.lifeCycle
    }

    this.register(name,
      factory,
      deps,
      new ArgumentInjector(),
      lifeCycle || this.lifeCycle,
      args)
  }

  /**
   * Register an instance (a concrete object). By default, instance dependencies use property/setter injection.
   * The deps array will be treated as a list of property names to be resolved on the dependency
   *
   * @param {string} name - Name to register this dependency with
   * @param {any} instance - The instance to register
   * @param {Array<String>} deps - An array of dependencies to be resolved before this dependency is injected
   * @param {SINGLETON|PROTOTYPE} lifeCycle - Life cycle of this dependency
   */
  registerInstance (name: any, deps?: string[]): void
  registerInstance (name: any, instance: any, deps?: string[], ...args: any[]): void
  registerInstance (name: any, instance: any = name, deps: string[] = [], lifeCycle?: LifeCycle): void {
    this.register(name,
      instance,
      deps,
      new PropertyInjector(),
      lifeCycle || this.lifeCycle)
  }

  /**
   * Register a dependency. This is called by registerType, registerFactory and registerInstance underneath to register
   * dependencies.
   *
   * @param {string} name - Name of the dependency
   * @param {any} dep - The dependency. Can be a type, factory or instance.
   * @param {array} deps - An array of dependencies to be resolved before this dependency is injected.
   * @param {Injector} injector - The injector to be used in order to perform the injection of the dependencies.
   * @param {SINGLETON|PROTOTYPE} lifeCycle - The life cycle for this dependency
   * @param {array} args - An array of addition arguments to be passed as is to the dependency.
   *                NOTE: Only applies to constructor or argument injectors
   */
  register (name: any, dep: any, deps: any[], injector: Injector, lifeCycle?: LifeCycle, ...args: any[]): void {
    if (!Array.isArray(deps)) {
      throw new Error('dependencies should be an array!')
    }

    const _dep = this.registry.get(name)
    if (_dep) {
      // tslint:disable-next-line: strict-type-predicates
      const _name = typeof _dep.constructor !== 'undefined' ? _dep.constructor : ''
      throw new Error(`another dependency with the same name ${name}` +
        ` is already registered by another dependency ${_name || ''}`)
    }

    this.registry.set(name, new Dependency(name,
      dep,
      deps,
      this.registry,
      injector,
      lifeCycle,
      ...args))

    this._circular(this.registry.get(name) as Dependency)
  }

  /**
   * Remove dependency from the registry
   *
   * @param {string} name
   * @returns {*}
   */
  deRegister (name: string) {
    const dep = this.registry.get(name)
    if (dep) {
      this.registry.delete(name)
    }

    return dep
  }

  /**
   * Inject all dependencies
   */
  async inject () {
    for (const dep of this.registry.values()) {
      await dep.inject() // inject all dependencies
    }
  }

  /**
   * Check for circular dependencies
   *
   * @param {Dependency} dep - the dependency to check
   * @param {Dependency} checky - the object to check against
   */
  _circular (dep: Dependency, checky: Dependency = dep) {
    dep.deps.forEach((depName) => {
      const d = this.registry.get(depName)

      if (d && d.name === checky.name) {
        throw new Error(`Circular dependency detected, '${checky.name}' ` +
          `is required by '${dep.name}', that also has '${checky.name}' in its dependency graph`)
      }

      if (d) this._circular(d, checky)
      return depName
    })
  }
}
