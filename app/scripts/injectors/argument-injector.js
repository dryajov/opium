/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

import Injector from '../injector';

export default class ArgumentInjector extends Injector {
    inject(dep) {
        let allDeps = super.inject(dep);

        // inject as parameters
        return dep.dep.apply(dep.dep, allDeps ? allDeps.map((d) => d.injected) : null);
    }
}
