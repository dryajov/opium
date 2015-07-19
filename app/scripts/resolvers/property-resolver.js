/**
 * Created by dmitriy.ryajov on 7/17/15.
 */

import Resolver from './resolver';

export default class PropResolver extends Resolver {
    constructor(injector, propName = '$inject') {
        super(injector);

        this.propName = propName;
    }

    resolve(obj) {
        if (!obj || (obj && !(this.propName in obj))) {
            console.info(`Undefined object or no injector property "${this.propName}" found!`);
            return;
        }

        return obj[this.propName];
    }
}
