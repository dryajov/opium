/**
 * Created by dmitriy.ryajov on 6/27/15.
 *
 * Default injector implements property injection
 */

import Injector from '../injector';

/**
 * This class will perform property injection, by matching
 * dependency names to property names. The property is expected
 * to be defined and set to null, otherwise no injection is performed.
 */
export default class PropertyInjector extends Injector {

    /**
     * Inject the dependency by calling dependency['property name'] = dep1;
     *
     * @param dep
     * @returns {dep|*|Dependency.dep}
     */
    inject(dep) {
        let allDeps = super.inject(dep);

        if (!allDeps) {
            return null;
        }

        allDeps.forEach((depDep) => {
            if (typeof dep.dep[depDep.name] === 'undefined') {
                console.error(`Property ${depDep.name} undefined in dependency ${dep.name}`);

                return;
            }

            if (dep.dep[depDep.name]) {
                console.warn(`Property ${depDep.name} not null in dependency ${dep.name}`);
            }

            dep.dep[depDep.name] = depDep.injected; // set property
        });

        return dep.dep;
    }
}
