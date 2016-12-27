/*jshint unused:false*/

import 'babel-polyfill';

import Dependency from './dependency';
import Injector   from './injector';

import {
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector
} from './injectors';

import {
  SINGLETON,
  PROTOTYPE,
  TYPE,
  FACTORY,
  INSTANCE,
} from './consts';

import {PropResolver, Resolver}   from './resolvers';

class Opium {
  constructor(name = 'default', lifeCycle = SINGLETON) {
    this.name = name;
    this.registry = new Map();
    this.lifeCycle = lifeCycle;
  }

  get defaultLifecycle() {
    return this.lifeCycle;
  }

  set defaultLifecycle(val) {
    this.lifeCycle = val;
  }

  /**
   * Ge dependency by name
   *
   * @param name
   * @returns {*}
   */
  getDep(name) {
    return this.registry.get(name);
  }

  /**
   * Register a type. By default, type dependencies use constructor injection.
   *
   * @param name - Name to register this dependency with
   * @param type - The type that this dependency is going to be registered with
   * @param deps - An array of dependencies to be resolved before this dependency is created
   * @param lifecycle - Lifecycle of this dependency
   * @param args - An array of addition arguments to be passed as is to the constructor of the type
   */
  registerType(name, type, deps = null, lifecycle = null, args = null) {
    this.register(name,
      type,
      deps,
      new ConstructorInjector(),
      lifecycle || this.defaultLifecycle);
  }

  /**
   * Register a factory. By default, factory dependencies use argument injection.
   *
   * @param name - Name to register this dependency with
   * @param factory - The factory that will be used to create the dependency
   * @param deps - An array of dependencies to be resolved before this factory is called
   * @param lifecycle - Lifecycle of this dependency
   * @param args - An array of addition arguments to be passed as is to the factory function
   */
  registerFactory(name, factory, deps = null, lifecycle = null, args = null) {
    this.register(name,
      factory,
      deps,
      new ArgumentInjector(),
      lifecycle || this.defaultLifecycle);
  }

  /**
   * Register an instance (a concrete object). By default, instance dependencies use property/setter injection.
   *
   * @param name - Name to register this dependency with
   * @param instance - The instance to register
   * @param deps - An array of dependencies to be resolved before this factory is called
   * @param lifecycle - Lifecycle of this dependency
   */
  registerInstance(name, instance, deps = null, lifecycle = null) {
    this.register(name,
      instance,
      deps,
      new PropertyInjector(),
      lifecycle || this.defaultLifecycle);
  }

  /**
   * Register a dependency. This is called by registerType, registerFactory and registerInstance underneath to register
   * dependencies.
   *
   * @param name - Name of the dependency
   * @param dep - The dependency. Can be a type, factory or instance.
   * @param deps - An array of dependencies to be resolved before this dependency is injected.
   * @param injector - The injector to be used in order to perform the injection of the dependencies.
   * @param lifecycle - The lifecycle for this dependency {SINGLETON, PROTOTYPE}
   * @param args - An array of addition arguments to be passed as is to the dependency.
   *                NOTE: Only applies to constructor or argument injectors
   */
  register(name, dep, deps, injector, lifecycle, args) {
    this.registry.set(name, new Dependency(name,
      dep,
      deps,
      this.registry,
      injector,
      lifecycle,
      args));
  }

  /**
   * Remove dependency from the registry
   *
   * @param name
   * @returns {*}
   */
  unRegister(name) {
    let dep = this.registry.get(name);
    if (dep) {
      this.registry.delete(name);
    }

    return dep;
  }

  /**
   * Inject all dependencies
   */
  inject() {
    for (let dep of this.registry.values()) {
      dep.inject(); // inject all dependencies
    }
  }
}

export {
  SINGLETON,
  PROTOTYPE,
  TYPE,
  FACTORY,
  INSTANCE,
  PropResolver,
  Resolver,
  Dependency,
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector,
  Injector,
  Opium
};
