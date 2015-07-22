/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

import Injector from '../injector';

/**
 * This class will perform constructor injection, by instantiating
 * the passed in dependency and passing in its deps as constructor
 * arguments. Dependency is expected to be a constructor function,
 * or an ES6+ class.
 */
export default class ConstructorInjector extends Injector {

    /**
     * Inject the dependency by calling class Reflect.construct(dependency, arguments)
     *
     * @param dep
     * @returns {*}
     */
    inject(dep) {
        let allDeps = super.inject(dep);

        // inject as constructor params
        return this._newCall(dep.dep, allDeps ? allDeps.map((d) => d.injected) : null);
    }

    _newCall(Clazz, args) {
        /*jshint -W058 */
        return Reflect.construct(Clazz, args);
    }
}
