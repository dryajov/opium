/*jshint unused:false*/
import Dependency from './dependency';
import PropertyInjector from './injectors/property-injector';
import ConstructorInjector from './injectors/constructor-injector';
import ArgumentInjector from './injectors/argument-injector';
import {SINGLETON, PROTOTYPE} from './consts';

export default class Opium {
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
     * @param options - An options object to configure this dependency
     */
    registerType(name, type, deps = null, options = {}) {
        this.register(name,
            type,
            deps,
            new ConstructorInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    /**
     * Register a factory. By default, factory dependencies use argument injection.
     *
     * @param name - Name to register this dependency with
     * @param factory - The factory that will be used to create the dependency
     * @param deps - An array of dependencies to be resolved before this factory is called
     * @param options - An options object to configure this dependency
     */
    registerFactory(name, factory, deps = null, options = {}) {
        this.register(name,
            factory,
            deps,
            new ArgumentInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    /**
     * Register an instance (a concrete object). By default, instance dependencies use property/setter injection.
     *
     * @param name
     * @param instance
     * @param deps
     * @param options
     */
    registerInstance(name, instance, deps = null, options = {}) {
        this.register(name,
            instance,
            deps,
            new PropertyInjector(),
            options.lifecycle || this.defaultLifecycle);
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
     */
    register(name, dep, deps, injector, lifecycle) {
        this.registry.set(name, new Dependency(name,
            dep,
            deps,
            this.registry,
            injector,
            lifecycle));
    }

    /**
     * Inject all dependencies in this context and its subcontexts
     */
    inject() {
        for (let dep of this.registry.values()) {
            dep.inject(); // inject all dependencies
        }
    }
}
