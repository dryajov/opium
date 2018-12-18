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

const { PropResolver, Resolver } = require('./resolvers')
const Opium = require('./opium')

module.exports = {
  SINGLETON,
  PROTOTYPE,
  TYPE,
  FACTORY,
  INSTANCE,
  PropResolver,
  Resolver,
  Dependency,
  PropertyInjector,
  ConstructorInjector,
  ArgumentInjector,
  Injector,
  Opium
}
