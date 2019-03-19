'use strict'

const Dependency = require('./dependency')

const {
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector
} = require('./injectors')

const { SINGLETON } = require('./consts')

class Opium {
  constructor (name = 'default', lifeCycle = SINGLETON) {
    this.name = name
    this.registry = new Map()
    this.lifeCycle = lifeCycle
  }

  get defaultLifeCycle () {
    return this.lifeCycle
  }

  set defaultLifeCycle (val) {
    this.lifeCycle = val
  }

  /**
   * Ge dependency by name
   *
   * @param {strict} name
   * @returns {*}
   */
  getDep (name) {
    return this.registry.get(name)
  }

  /**
   * Register a type. By default, type dependencies use constructor injection.
   *
   * @param {strict} name - Name to register this dependency with
   * @param {any} type - The type that this dependency is going to be registered with
   * @param {array} deps - An array of dependencies to be resolved before this dependency is created
   * @param {SINGLETON|PROTOTYPE} lifeCycle - Life cycle of this dependency
   * @param {array} args - An array of addition arguments to be passed as is to the constructor of the type
   */
  registerType (name, type, deps = [], lifeCycle = null, args = null) {
    this.register(name,
      type,
      deps,
      new ConstructorInjector(),
      lifeCycle || this.defaultLifeCycle)
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
  registerFactory (name, factory, deps = [], lifeCycle = null, args = null) {
    this.register(name,
      factory,
      deps,
      new ArgumentInjector(),
      lifeCycle || this.defaultLifeCycle)
  }

  /**
   * Register an instance (a concrete object). By default, instance dependencies use property/setter injection.
   *
   * @param {string} name - Name to register this dependency with
   * @param {any} instance - The instance to register
   * @param {array} deps - An array of dependencies to be resolved before this factory is called
   * @param {SINGLETON|PROTOTYPE} lifeCycle - Life cycle of this dependency
   */
  registerInstance (name, instance, deps = [], lifeCycle = null) {
    this.register(name,
      instance,
      deps,
      new PropertyInjector(),
      lifeCycle || this.defaultLifeCycle)
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
  register (name, dep, deps, injector, lifeCycle, args) {
    if (!Array.isArray(deps)) {
      throw new Error('dependencies should be an array!')
    }

    this.registry.set(name, new Dependency(name,
      dep,
      deps,
      this.registry,
      injector,
      lifeCycle,
      args))
  }

  /**
   * Remove dependency from the registry
   *
   * @param {string} name
   * @returns {*}
   */
  deRegister (name) {
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
}

module.exports = Opium
