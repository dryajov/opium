import Opium from '../../app/scripts/opium';
import {SINGLETON, PROTOTYPE} from '../../app/scripts/consts';

describe('opium', () => {

    //it('should exist', function () {
    //    expect(Opium).to.exist(); // this doesn't work, since Opium class doesn't exist when transpiled
    //});

    describe('factory tests', () => {

        let opium, factory;
        beforeEach(() => {
            opium = new Opium();
            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            factory = function (param1, param2) {
                return [param1, param2, ++count];
            }
        });

        it('factory should inject singleton', () => {
            opium.registerFactory('factory', factory, ['param1', 'param2']);

            let dep = opium.getDep('factory');

            let injected = dep.inject();
            expect(dep.name).toBe('factory');
            expect(injected[0]).toBe('param 1');
            expect(injected[1]).toBe('param 2');
            expect(injected[2]).toBe(1);

            let injected1 = dep.inject();
            expect(injected1[0]).toBe('param 1');
            expect(injected1[1]).toBe('param 2');
            expect(injected1[2]).toBe(1);
        });

        it('factory should inject prototype', () => {
            opium.registerFactory('factory', factory, ['param1', 'param2'], {lifecycle: PROTOTYPE});

            let dep = opium.getDep('factory');

            let injected = dep.inject();
            expect(dep.name).toBe('factory');
            expect(injected[0]).toBe('param 1');
            expect(injected[1]).toBe('param 2');
            expect(injected[2]).toBe(1);

            let injected1 = dep.inject();
            expect(injected1[0]).toBe('param 1');
            expect(injected1[1]).toBe('param 2');
            expect(injected1[2]).toBe(2);
        });
    });

    describe('type tests', () => {
        let count, opium;
        class MyType {
            constructor(param1, param2) {
                this.param1 = param1;
                this.param2 = param2;
                this.count = ++count;
            }
        }

        beforeEach(() => {
            count = 0;
            opium = new Opium();
            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');
        });

        it('type should inject singleton', () => {
            opium.registerType('type', MyType, ['param1', 'param2']);

            let dep = opium.getDep('type');
            let injected = dep.inject();

            expect(injected.param1).toBe('param 1');
            expect(injected.param2).toBe('param 2');
            expect(injected.count).toBe(1);

            let injected1 = dep.inject();

            expect(injected1.param1).toBe('param 1');
            expect(injected1.param2).toBe('param 2');
            expect(injected1.count).toBe(1);
        });

        it('type should inject prototype', () => {
            opium.registerType('type', MyType, ['param1', 'param2'], {lifecycle: PROTOTYPE});

            let dep = opium.getDep('type');
            let injected = dep.inject();

            expect(injected.param1).toBe('param 1');
            expect(injected.param2).toBe('param 2');
            expect(injected.count).toBe(1);

            let injected1 = dep.inject();

            expect(injected1.param1).toBe('param 1');
            expect(injected1.param2).toBe('param 2');
            expect(injected1.count).toBe(2);
        });
    });

    describe('instance tests', () => {

        class MyType {
            constructor() {
                this.param1 = null;
                this.param2 = null;
                this.count = null;
            }
        }

        let opium, count, factory;
        beforeEach(() => {
            opium = new Opium();

            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            count = 0;
            factory = function () {
                return ++count;
            }
        });

        it('instance should inject singleton', () => {
            opium.registerFactory('count', factory);

            let instance = new MyType();

            opium.registerInstance('type', instance, ['param1', 'param2', 'count']);

            let dep = opium.getDep('type');
            let injected = dep.inject();

            expect(injected.param1).toBe('param 1');
            expect(injected.param2).toBe('param 2');
            expect(injected.count).toBe(1);

            let injected1 = dep.inject();

            expect(injected1.param1).toBe('param 1');
            expect(injected1.param2).toBe('param 2');
            expect(injected1.count).toBe(1);
        });

        it('instance should inject prototype', () => {
            opium.registerFactory('count', factory, ['param1', 'param2'], {lifecycle: PROTOTYPE});

            let instance = new MyType();

            opium.registerInstance('type', instance, ['param1', 'param2', 'count'], {lifecycle: PROTOTYPE});

            let dep = opium.getDep('type');
            let injected = dep.inject();

            expect(injected.param1).toBe('param 1');
            expect(injected.param2).toBe('param 2');
            expect(injected.count).toBe(1);

            let injected1 = dep.inject();

            expect(injected1.param1).toBe('param 1');
            expect(injected1.param2).toBe('param 2');
            expect(injected1.count).toBe(2);
        });
    });

    describe('inject all', () => {

        class MyType {
            constructor(param1, param2, factoryVal) {
                this.param1 = param1;
                this.param2 = param2;
                this.factoryVal = factoryVal;
            }
        }

        let opium, factory;
        beforeEach(() => {
            opium = new Opium();
        });

        it('should inject all', () => {
            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            factory = function (param1, param2) {
                return [param1, param2];
            };
            factory.inject = ['param1', 'param2'];

            opium.registerFactory('factory', factory, ['param1', 'param2']);

            let type = MyType;
            opium.registerType('type', type, ['param1', 'param2', 'factory']);

            opium.inject();

            let injectedFactory = opium.getDep('factory').injected;
            let injectedType = opium.getDep('type').injected;
            let injectedParam1 = opium.getDep('param1').injected;
            let injectedParam2 = opium.getDep('param2').injected;

            expect(injectedParam1).toBe('param 1');
            expect(injectedParam2).toBe('param 2');
            expect(injectedFactory[0]).toBe('param 1');
            expect(injectedFactory[1]).toBe('param 2');
            expect(injectedType.param1).toBe('param 1');
            expect(injectedType.param2).toBe('param 2');
            expect(injectedType.factoryVal[0]).toBe('param 1');
            expect(injectedType.factoryVal[1]).toBe('param 2');
        })
    });
});
