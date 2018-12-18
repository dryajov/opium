'use strict'

const Dependency = require('./dependency')
const Injector = require('./injector')

const {
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector
} = require('./injectors')

const {
  SINGLETON,
  PROTOTYPE,
  TYPE,
  FACTORY,
  INSTANCE
} = require('./consts')

const Opium = require('./opium')

module.exports = {
  SINGLETON,
  PROTOTYPE,
  TYPE,
  FACTORY,
  INSTANCE,
  Dependency,
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector,
  Injector,
  Opium
}
