/**
 * Created by dmitriy.ryajov on 6/27/15.
 *
 * Default injector implements property injection
 */

import Injector from '../injector';

export default class PropertyInjector extends Injector {
    inject(dep) {
        let allDeps = super.inject(dep);

        if (!allDeps) {
            return;
        }

        allDeps.forEach((depDep) => {
            if (typeof dep.dep[depDep.name] === 'undefined') {
                console.warn(`Unable to inject dependency ${depDep.name} into ${dep.name}`);
            }

            dep.dep[depDep.name] = depDep.injected; // set property
        });

        return dep.dep;
    }
}
