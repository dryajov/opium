/**
 * Created by dmitriy.ryajov on 6/27/15.
 */

export default class Injector {
    inject(dep) {
        var allDeps = dep.resolve();
        if (!allDeps) {
            return;
        }

        allDeps.forEach((depDep) => depDep.inject());
        return allDeps;
    }
}
