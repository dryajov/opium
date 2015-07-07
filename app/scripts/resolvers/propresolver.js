/**
 * Created by dmitriy.ryajov on 6/14/15.
 */

import Resolver from '../resolver';

export default class PropResolver extends Resolver {
    constructor(registry, propName = 'inject') {
        super(registry);
        this.propName = propName;
    }

    resolveAll(obj) {
        if (!obj || (obj && !obj.hasOwnProperty(this.propName))) {
            console.info(`Undefined object or no injector property "${this.propName}" found!`);
            return;
        }

        return super.resolveAll(obj[this.propName]);
    }
}
