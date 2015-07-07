/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

import {SINGLETON, PROTOTYPE} from './consts';

export default class Dependency {
    /*jshint maxparams: 5 */
    constructor(name, dep, resolver, registry, injector, lifecycle) {
        this.name = name;
        this.dep = dep;
        this.registry = registry;
        this.resolver = resolver;
        this.injector = injector;
        this.lifecycle = lifecycle;

        this.deps = [];
        this.injected = null;
    }

    getDep(name) {
        for (let dep of this.deps) {
            if (dep.name === name) {
                return dep;
            }
        }

        throw new Error(`No dependency found for ${name}`);
    }

    resolve() {
        this.deps = this.resolver.resolveAll(this.dep);
        return this.deps;
    }

    inject() {
        if (!this.injected || this.lifecycle === PROTOTYPE) {
            this.injected = this.injector.inject(this) || this.dep;
        }

        return this.injected;
    }
}
