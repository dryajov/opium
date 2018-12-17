/* eslint-env jasmine */

import {
  Opium,
  PROTOTYPE
} from '../src/opium'

describe('opium', () => {
  // it('should exist', function () {
  //   expect(Opium).to.exist() // this doesn't work, since Opium class doesn't exist when transpiled
  // })

  describe('factory tests', () => {
    let opium
    let factory

    beforeEach(() => {
      opium = new Opium()
      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      let count = 0
      factory = function (param1, param2) {
        return [param1, param2, ++count]
      }
    })

    it('factory should inject singconston', () => {
      opium.registerFactory('factory', factory, ['param1', 'param2'])

      const dep = opium.getDep('factory')

      const injected = dep.inject()
      expect(dep.name).toBe('factory')
      expect(injected[0]).toBe('param 1')
      expect(injected[1]).toBe('param 2')
      expect(injected[2]).toBe(1)

      const injected1 = dep.inject()
      expect(injected1[0]).toBe('param 1')
      expect(injected1[1]).toBe('param 2')
      expect(injected1[2]).toBe(1)
    })

    it('factory should inject prototype', () => {
      opium.registerFactory('factory', factory, ['param1', 'param2'], PROTOTYPE)

      const dep = opium.getDep('factory')

      const injected = dep.inject()
      expect(dep.name).toBe('factory')
      expect(injected[0]).toBe('param 1')
      expect(injected[1]).toBe('param 2')
      expect(injected[2]).toBe(1)

      const injected1 = dep.inject()
      expect(injected1[0]).toBe('param 1')
      expect(injected1[1]).toBe('param 2')
      expect(injected1[2]).toBe(2)
    })
  })

  describe('type tests', () => {
    let count, opium
    class MyType {
      constructor (param1, param2) {
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

    it('type should inject singconston', () => {
      opium.registerType('type', MyType, ['param1', 'param2'])

      const dep = opium.getDep('type')
      const injected = dep.inject()

      expect(injected.param1).toBe('param 1')
      expect(injected.param2).toBe('param 2')
      expect(injected.count).toBe(1)

      const injected1 = dep.inject()

      expect(injected1.param1).toBe('param 1')
      expect(injected1.param2).toBe('param 2')
      expect(injected1.count).toBe(1)
    })

    it('type should inject prototype', () => {
      opium.registerType('type', MyType, ['param1', 'param2'], PROTOTYPE)

      const dep = opium.getDep('type')
      const injected = dep.inject()

      expect(injected.param1).toBe('param 1')
      expect(injected.param2).toBe('param 2')
      expect(injected.count).toBe(1)

      const injected1 = dep.inject()

      expect(injected1.param1).toBe('param 1')
      expect(injected1.param2).toBe('param 2')
      expect(injected1.count).toBe(2)
    })
  })

  describe('instance tests', () => {
    class MyType {
      constructor () {
        this.param1 = null
        this.param2 = null
        this.count = null
      }
    }

    let opium, count, factory
    beforeEach(() => {
      opium = new Opium()

      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      count = 0
      factory = function () {
        return ++count
      }
    })

    it('instance should inject singleton', () => {
      opium.registerFactory('count', factory)

      const instance = new MyType()

      opium.registerInstance('instance', instance, ['param1', 'param2', 'count'])

      const dep = opium.getDep('instance')
      const injected = dep.inject()

      expect(injected.param1).toBe('param 1')
      expect(injected.param2).toBe('param 2')
      expect(injected.count).toBe(1)

      const injected1 = dep.inject()

      expect(injected1.param1).toBe('param 1')
      expect(injected1.param2).toBe('param 2')
      expect(injected1.count).toBe(1)
    })

    it('instance should inject prototype', () => {
      opium.registerFactory('count', factory, ['param1', 'param2'], PROTOTYPE)

      const instance = new MyType()

      opium.registerInstance('type', instance, ['param1', 'param2', 'count'], PROTOTYPE)

      const dep = opium.getDep('type')
      const injected = dep.inject()

      expect(injected.param1).toBe('param 1')
      expect(injected.param2).toBe('param 2')
      expect(injected.count).toBe(1)

      const injected1 = dep.inject()

      expect(injected1.param1).toBe('param 1')
      expect(injected1.param2).toBe('param 2')
      expect(injected1.count).toBe(2)
    })
  })

  describe('inject all', () => {
    class MyType {
      constructor (param1, param2, factoryVal) {
        this.param1 = param1
        this.param2 = param2
        this.factoryVal = factoryVal
      }
    }

    let opium, factory
    beforeEach(() => {
      opium = new Opium()
    })

    it('should inject all', () => {
      opium.registerInstance('param1', 'param 1')
      opium.registerInstance('param2', 'param 2')

      factory = function (param1, param2) {
        return [param1, param2]
      }

      opium.registerFactory('factory', factory, ['param1', 'param2'])

      const type = MyType
      opium.registerType('type', type, ['param1', 'param2', 'factory'])

      opium.inject()

      const injectedFactory = opium.getDep('factory').injected
      const injectedType = opium.getDep('type').injected
      const injectedParam1 = opium.getDep('param1').injected
      const injectedParam2 = opium.getDep('param2').injected

      expect(injectedParam1).toBe('param 1')
      expect(injectedParam2).toBe('param 2')
      expect(injectedFactory[0]).toBe('param 1')
      expect(injectedFactory[1]).toBe('param 2')
      expect(injectedType.param1).toBe('param 1')
      expect(injectedType.param2).toBe('param 2')
      expect(injectedType.factoryVal[0]).toBe('param 1')
      expect(injectedType.factoryVal[1]).toBe('param 2')
    })
  })

  describe('error handling', () => {
    let opium
    beforeEach(() => {
      opium = new Opium()
    })

    it('should fail circular dependency', () => {
      try {
        opium.registerInstance('instance1', {}, ['instance1'])
      } catch (e) {
        expect(e).toEqual(new Error(`Can't inject instance1 into instance1`))
      }
    })
  })
})
