/**
 * Created by dmitriy.ryajov on 7/17/15.
 */

import {TYPE, FACTORY, INSTANCE} from '../consts';

export default class Resolver {
    constructor(injector) {
        this.injector = injector;
    }

    register(name, dep, type) {
        let deps = this.resolve(dep);
        if (deps) {
            switch(type) {
                case TYPE: {
                    this.injector.registerType(name, dep, deps);
                    break;
                }

                case FACTORY: {
                    this.injector.registerFactory(name, dep, deps);
                    break;
                }

                case INSTANCE: {
                    this.injector.registerInstance(name, dep, deps);
                    break;
                }

                default: throw(`Unknown type ${type}`);

            }
        }
    }

    resolve(dep) {
        throw 'method unimplemented!';
    }
}
