/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

import {SINGLETON, PROTOTYPE} from './consts';

export default class Dependency {
    constructor(name, dep, deps, registry, injector, lifecycle) {
        this.name = name;
        this.dep = dep;
        this.registry = registry;
        this.injector = injector;
        this.lifecycle = lifecycle;

        this.deps = deps;
        this.injected = null;

        if (this.deps && this.deps.filter((depName) => {return this.name === depName}).length) {
            throw new Error(`Can't inject ${this.name} into ${this.name}`);
        }
    }

    getDep(name) {
        for (let dep of this.deps) {
            if (dep.name === name) {
                return dep;
            }
        }

        throw new Error(`No dependency found for ${name}`);
    }

    inject() {
        if (!this.injected || this.lifecycle === PROTOTYPE) {
            this.injected = this.injector.inject(this) || this.dep;
        }

        return this.injected;
    }

    resolve() {
        let dependencies = [];
        if (this.deps) {
            for (let name of this.deps) {
                dependencies.push(this.registry.get(name));
            }
        }

        return dependencies;
    }
}
