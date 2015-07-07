import Opium from '../../app/scripts/opium';
import {SINGLETON, PROTOTYPE} from '../../app/scripts/consts';

describe('opium', function () {

    //it('should exist', function () {
    //    expect(Opium).to.exist(); // this doesn't work, since Opium class doesn't exist when transpiled
    //});

    describe('factory tests', function () {
        it('factory should inject singleton', function () {
            let opium = new Opium();
            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            let factory = function (param1, param2) {
                return [param1, param2, ++count];
            };
            factory.inject = ['param1', 'param2'];
            opium.registerFactory('factory', factory);

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

        it('factory should inject prototype', function () {
            let opium = new Opium();
            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            let factory = function (param1, param2) {
                return [param1, param2, ++count];
            };
            factory.inject = ['param1', 'param2'];
            opium.registerFactory('factory', factory, {lifecycle: PROTOTYPE});

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

    describe('type tests', function () {
        it('type should inject singleton', function () {
            let opium = new Opium();

            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            class MyType {
                constructor(param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                    this.count = ++count;
                }
            }

            MyType.inject = ['param1', 'param2'];
            opium.registerType('type', MyType);

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

        it('type should inject prototype', function () {
            let opium = new Opium();

            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            class MyType {
                constructor(param1, param2) {
                    this.param1 = param1;
                    this.param2 = param2;
                    this.count = ++count;
                }
            }

            MyType.inject = ['param1', 'param2'];
            opium.registerType('type', MyType, {lifecycle: PROTOTYPE});

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

    describe('instance tests', function () {
        it('instance should inject singleton', function () {
            let opium = new Opium();

            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            let factory = function () {
                return ++count;
            };

            opium.registerFactory('count', factory);

            class MyClass {
                constructor() {
                    this.param1 = null;
                    this.param2 = null;
                    this.count = null;
                }
            }

            let instance = new MyClass();
            instance.inject = ['param1', 'param2', 'count'];

            opium.registerInstance('type', instance);

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

        it('instance should inject prototype', function () {
            let opium = new Opium();

            opium.registerInstance('param1', 'param 1');
            opium.registerInstance('param2', 'param 2');

            let count = 0;
            let factory = function () {
                return ++count;
            };

            opium.registerFactory('count', factory, {lifecycle: PROTOTYPE});

            class MyClass {
                constructor() {
                    this.param1 = null;
                    this.param2 = null;
                    this.count = null;
                }
            }

            let instance = new MyClass();
            instance.inject = ['param1', 'param2', 'count'];

            opium.registerInstance('type', instance, {lifecycle: PROTOTYPE});

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
});
