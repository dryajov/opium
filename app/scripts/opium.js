/*jshint unused:false*/
import PropResolver from './resolvers/propresolver';
import Dependency from './dependency';
import PropertyInjector from './injectors/property-injector';
import ConstructorInjector from './injectors/constructor-injector';
import ArgumentInjector from './injectors/argument-injector';
import {SINGLETON, PROTOTYPE} from './consts';

export default class Opium {
    constructor(resolver = new PropResolver(), lifeCycle = SINGLETON) {
        this.registry = new Map();
        this.lifeCycle = lifeCycle;
        this.defaultResolver = resolver;
        resolver.registry = resolver.registry || this.registry;
    }

    get defaultLifecycle() {
        return this.lifeCycle;
    }

    set defaultLifecycle(val) {
        this.lifeCycle = val;
    }

    getDep(name) {
        return this.registry.get(name);
    }

    registerType(name, type, options) {
        options = options || {};
        this.register(name,
            type,
            options.resolver || this.defaultResolver,
            new ConstructorInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    registerFactory(name, factory, options) {
        options = options || {};
        this.register(name,
            factory,
            options.resolver || this.defaultResolver,
            new ArgumentInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    registerInstance(name, instance, options) {
        options = options || {};
        this.register(name,
            instance,
            options.resolver || this.defaultResolver,
            new PropertyInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    register(name, dep, resolver, injector, lifecycle) {
        this.registry.set(name, new Dependency(name,
            dep,
            resolver,
            this.registry,
            injector,
            lifecycle));
    }

    inject() {
        for (let dep of this.registry.values()) {
            dep.inject(); // inject all dependencies
        }
    }
}
