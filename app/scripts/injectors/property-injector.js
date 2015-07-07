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
            if (!dep.dep.hasOwnProperty(depDep.name)) {
                console.warn(`Unable to inject dependency ${depDep.name} for ${dep.name}`);
            }

            dep.dep[depDep.name] = depDep.injected; // set property
        });

        return dep.dep;
    }
}
