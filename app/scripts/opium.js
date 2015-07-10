/*jshint unused:false*/
import Dependency from './dependency';
import PropertyInjector from './injectors/property-injector';
import ConstructorInjector from './injectors/constructor-injector';
import ArgumentInjector from './injectors/argument-injector';
import {SINGLETON, PROTOTYPE} from './consts';

export default class Opium {
    constructor(lifeCycle = SINGLETON) {
        this.registry = new Map();
        this.lifeCycle = lifeCycle;
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

    registerType(name, type, deps, options) {
        options = options || {};
        this.register(name,
            type,
            deps,
            new ConstructorInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    registerFactory(name, factory, deps, options) {
        options = options || {};
        this.register(name,
            factory,
            deps,
            new ArgumentInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    registerInstance(name, instance, deps, options) {
        options = options || {};
        this.register(name,
            instance,
            deps,
            new PropertyInjector(),
            options.lifecycle || this.defaultLifecycle);
    }

    register(name, dep, deps, injector, lifecycle) {
        this.registry.set(name, new Dependency(name,
            dep,
            deps,
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
