/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

export default class Resolver {
    constructor(registry) {
        this.registry = registry;
    }

    resolveAll(names) {
        var deps = [];
        for (let name of names) {
            deps.push(this.registry.get(name));
        }

        return deps;
    }

    resolve(name) {
        return this.registry.get(name);
    }
}
