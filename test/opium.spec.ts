import * as chai from 'chai'
import dirtyChai = require('dirty-chai')
const expect: any = chai.expect
chai.use(dirtyChai)

import { Opium, LifeCycle } from '../src'

describe('opium', () => {
  it('should exist', function () {
    expect(Opium).to.exist() // this doesn't work, since Opium class doesn't exist when transpiled
  })

  describe('factory tests', () => {
    let opium: Opium
    let factory: Function

    beforeEach(() => {
      opium = new Opium()
      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      let count = 0
      factory = (param1: any, param2: any) => {
        return [param1, param2, ++count]
      }
    })

    it('factory should inject singleton', async () => {
      opium.registerFactory('factory', factory, ['param1', 'param2'])

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql(1)

      const injected1 = await dep.inject()
      expect(injected1[0]).to.eql('param 1')
      expect(injected1[1]).to.eql('param 2')
      expect(injected1[2]).to.eql(1)
    })

    it('factory should inject prototype', async () => {
      opium.registerFactory('factory', factory, ['param1', 'param2'], LifeCycle.PROTOTYPE)

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql(1)

      const injected1 = await dep.inject()
      expect(injected1[0]).to.eql('param 1')
      expect(injected1[1]).to.eql('param 2')
      expect(injected1[2]).to.eql(2)
    })

    it('factory should inject async factory method as prototype', async () => {
      let count = 0
      opium.registerFactory('factory', async (param1: any, param2: any) => {
        return new Promise((resolve: Function) => {
          return setTimeout(resolve([param1, param2, ++count]), 100)
        })
      },
        ['param1', 'param2'],
        LifeCycle.PROTOTYPE)

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql(1)

      const injected1 = await dep.inject()
      expect(injected1[0]).to.eql('param 1')
      expect(injected1[1]).to.eql('param 2')
      expect(injected1[2]).to.eql(2)
    })

    it('factory should inject async factory method as singleton', async () => {
      let count = 0
      opium.registerFactory('factory', async (param1: any, param2: any) => {
        return new Promise((resolve: Function) => {
          return setTimeout(resolve([param1, param2, ++count]), 1000)
        })
      },
        ['param1', 'param2'])

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql(1)

      const injected1 = await dep.inject()
      expect(injected1[0]).to.eql('param 1')
      expect(injected1[1]).to.eql('param 2')
      expect(injected1[2]).to.eql(1)
    })

    it('factory should inject with additional args', async () => {
      opium.registerFactory('factory',
      (param1: any, param2: any, param3: any, param4: any, param5: any) => {
        expect(param1).to.eq('param 1')
        expect(param2).to.eq('param 2')
        expect(param3).to.eq('param 3')
        expect(param4).to.eq('param 4')
        expect(param5).to.eq('param 5')

        return [param1, param2, param3, param4, param5]
      }, ['param1', 'param2'], ['param 3', 'param 4', 'param 5'])

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql('param 3')
      expect(injected[3]).to.eql('param 4')
      expect(injected[4]).to.eql('param 5')
    })

    it('factory should inject with additional args as promises', async () => {
      opium.registerFactory('factory', (param1: any, param2: any, param3: any, param4: any, param5: any) => {
        expect(param1).to.eq('param 1')
        expect(param2).to.eq('param 2')
        expect(param3).to.eq('param 3')
        expect(param4).to.eq('param 4')
        expect(param5).to.eq('param 5')

        return [param1, param2, param3, param4, param5]
      }, ['param1', 'param2'], [
        Promise.resolve('param 3'),
        Promise.resolve('param 4'),
        Promise.resolve('param 5')
      ])

      const dep = opium.getDep('factory')

      const injected = await dep.inject()
      expect(dep.name).to.eql('factory')
      expect(injected[0]).to.eql('param 1')
      expect(injected[1]).to.eql('param 2')
      expect(injected[2]).to.eql('param 3')
      expect(injected[3]).to.eql('param 4')
      expect(injected[4]).to.eql('param 5')
    })
  })

  describe('type tests', async () => {
    let count: number
    let opium: Opium
    class MyType {
      param1: any
      param2: any
      count: number

      constructor (param1: any, param2: any) {
        this.param1 = param1
        this.param2 = param2
        this.count = ++count
      }
    }

    beforeEach(() => {
      count = 0
      opium = new Opium()
      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')
    })

    it('type should inject singleton', async () => {
      opium.registerType('type', MyType, ['param1', 'param2'])

      const dep = opium.getDep('type')
      const injected = await dep.inject()

      expect(injected.param1).to.eql('param 1')
      expect(injected.param2).to.eql('param 2')
      expect(injected.count).to.eql(1)

      const injected1 = await dep.inject()

      expect(injected1.param1).to.eql('param 1')
      expect(injected1.param2).to.eql('param 2')
      expect(injected1.count).to.eql(1)
    })

    it('type should inject prototype', async () => {
      opium.registerType('type', MyType, ['param1', 'param2'], LifeCycle.PROTOTYPE)

      const dep = opium.getDep('type')
      const injected = await dep.inject()

      expect(injected.param1).to.eql('param 1')
      expect(injected.param2).to.eql('param 2')
      expect(injected.count).to.eql(1)

      const injected1 = await dep.inject()

      expect(injected1.param1).to.eql('param 1')
      expect(injected1.param2).to.eql('param 2')
      expect(injected1.count).to.eql(2)
    })
  })

  describe('instance tests', () => {
    class MyType {
      param1: any
      param2: any
      count: number | null
      constructor () {
        this.param1 = null
        this.param2 = null
        this.count = null
      }
    }

    let opium: Opium
    let count: number
    let factory: () => number
    beforeEach(() => {
      opium = new Opium()

      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      count = 0
      factory = function () {
        return ++count
      }
    })

    it('instance should inject singleton', async () => {
      opium.registerFactory('count', factory)
      opium.registerInstance('instance', new MyType(), ['param1', 'param2', 'count'])

      const dep = opium.getDep('instance')
      const injected = await dep.inject()

      expect(injected.param1).to.eql('param 1')
      expect(injected.param2).to.eql('param 2')
      expect(injected.count).to.eql(1)

      const injected1 = await dep.inject()

      expect(injected1.param1).to.eql('param 1')
      expect(injected1.param2).to.eql('param 2')
      expect(injected1.count).to.eql(1)
    })

    it('instance should inject prototype', async () => {
      opium.registerFactory('count', factory, ['param1', 'param2'], LifeCycle.PROTOTYPE)
      opium.registerInstance('type', new MyType(), ['param1', 'param2', 'count'], LifeCycle.PROTOTYPE)

      const dep = opium.getDep('type')
      const injected = await dep.inject()

      expect(injected.param1).to.eql('param 1')
      expect(injected.param2).to.eql('param 2')
      expect(injected.count).to.eql(1)

      const injected1 = await dep.inject()

      expect(injected1.param1).to.eql('param 1')
      expect(injected1.param2).to.eql('param 2')
      expect(injected1.count).to.eql(2)
    })
  })

  describe('inject all', () => {
    class MyType {
      param1: any
      param2: any
      factoryVal: any

      constructor (param1: any, param2: any, factoryVal: any) {
        this.param1 = param1
        this.param2 = param2
        this.factoryVal = factoryVal
      }
    }

    let opium: Opium
    let factory: Function
    beforeEach(() => {
      opium = new Opium()
    })

    it('should inject all', async () => {
      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      factory = function (param1: any, param2: any) {
        return [param1, param2]
      }

      opium.registerFactory('factory', factory, ['param1', 'param2'])

      const type = MyType
      opium.registerType('type', type, ['param1', 'param2', 'factory'])

      await opium.inject()

      const injectedFactory = opium.getDep('factory').injected
      const injectedType = opium.getDep('type').injected
      const injectedParam1 = opium.getDep('param1').injected
      const injectedParam2 = opium.getDep('param2').injected

      expect(injectedParam1).to.eql('param 1')
      expect(injectedParam2).to.eql('param 2')
      expect(injectedFactory[0]).to.eql('param 1')
      expect(injectedFactory[1]).to.eql('param 2')
      expect(injectedType.param1).to.eql('param 1')
      expect(injectedType.param2).to.eql('param 2')
      expect(injectedType.factoryVal[0]).to.eql('param 1')
      expect(injectedType.factoryVal[1]).to.eql('param 2')
    })
  })

  describe('error handling', () => {
    let opium: Opium
    beforeEach(() => {
      opium = new Opium()
    })

    it('should fail injecting itself into itself', async () => {
      try {
        opium.registerInstance('instance1', {}, ['instance1'])
      } catch (e) {
        expect(e).to.be.an('error')
        expect(e).to.match(/Can't inject instance1 into instance1/)
      }
    })

    it('should fail on simple circular dependencies for types', async () => {
      opium.registerType('instance1', class { }, ['instance2'])
      expect(() => opium.registerType('instance2', class { }, ['instance1']))
        .to.throw(/Circular dependency detected, 'instance2' is required by 'instance1', that also has 'instance2' in its dependency graph/)
    })

    it('should fail on complex circular dependencies for types', async () => {
      opium.registerType('instance1', class { }, ['instance3'])
      opium.registerType('instance2', class { }, ['instance1'])
      expect(() => opium.registerType('instance3', {}, ['instance2']))
        .to.throw(/Circular dependency detected, 'instance3' is required by 'instance1', that also has 'instance3' in its dependency graph/)
    })

    it('should fail on simple circular dependencies for factories', async () => {
      opium.registerFactory('instance1', () => '', ['instance2'])
      expect(() => opium.registerFactory('instance2', () => '', ['instance1']))
        .to.throw(/Circular dependency detected, 'instance2' is required by 'instance1', that also has 'instance2' in its dependency graph/)
    })

    it('should fail on complex circular dependencies factories', async () => {
      opium.registerFactory('instance1', () => '', ['instance3'])
      opium.registerFactory('instance2', () => '', ['instance1'])
      expect(() => opium.registerFactory('instance3', {}, ['instance2']))
        .to.throw(/Circular dependency detected, 'instance3' is required by 'instance1', that also has 'instance3' in its dependency graph/)
    })

    it('should fail on simple circular dependencies for instances', async () => {
      opium.registerInstance('instance1', {}, ['instance2'])
      expect(() => opium.registerInstance('instance2', {}, ['instance1']))
        .to.throw(/Circular dependency detected, 'instance2' is required by 'instance1', that also has 'instance2' in its dependency graph/)
    })

    it('should fail on complex circular dependencies instances', async () => {
      opium.registerInstance('instance1', {}, ['instance3'])
      opium.registerInstance('instance2', {}, ['instance1'])
      expect(() => opium.registerFactory('instance3', {}, ['instance2']))
        .to.throw(/Circular dependency detected, 'instance3' is required by 'instance1', that also has 'instance3' in its dependency graph/)
    })

    it('should fail if dependency not registered', async () => {
      try {
        opium.registerInstance('instance1', {}, ['dependency-does-not-exist'])
        const instDep = opium.getDep('instance1')
        const injected = await instDep.inject()
        expect(injected).to.not.exist()
      } catch (e) {
        expect(e).to.be.an('error')
        expect(e).to.match(/no dependency with name "dependency-does-not-exist" found!/)
      }
    })

    it('should fail if dependency is not an array', async () => {
      try {
        opium.registerInstance('instance1', {}, 'dependency-should-fail' as any)
        const instDep = opium.getDep('instance1')
        const injected = await instDep.inject()
        expect(injected).to.not.exist()
      } catch (e) {
        expect(e).to.be.an('error')
        expect(e).to.match(/dependencies should be an array!/)
      }
    })

    it('async factory should throw if not awaited', async () => {
      opium.registerFactory('factory', async () => {
        return new Promise((resolve: Function) => {
          return setTimeout(resolve(), 1000)
        })
      })

      try {
        const dep = opium.getDep('factory')
        // tslint:disable-next-line: no-floating-promises
        dep.inject() // first inject is not awaited
        await dep.inject() // second inject should throw
      } catch (e) {
        expect(e).to.be.an('error')
        expect(e).to.match(/Dependency has not finished resolving, make sure to await the inject method!/)
      }
    })
  })
})
