/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

import Injector from '../injector';

export default class ConstructorInjector extends Injector {
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
