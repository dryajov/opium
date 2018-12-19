# Opium

> Opium - DI for the masses.

`Opium` is a dependency injection framework for javascript. The aim of `opium` is to provide the simplest possible and yet functionally complete dependency injection solution.  `Opium`'s main feature is its lack of assumptions around dependency declaration techniques such as XML, JSON or a DSL. Instead, opium relies on a clean and non opinionated api, that leaves the door open to use your own style/technique for declaring dependencies.

## Getting started

`npm install --save opium-ioc`

### Usage

```javascript
const {Opium, PROTOTYPE, SINGLETON} = require('opium-ioc')

var opium = new Opium()

// register instance dependencies
opium.registerInstance('dep1Name', 'param 1')
opium.registerInstance('dep2Name', 'param 2')

let count = 0
// make a factory function that will get 
factory = async (dep1Name, dep2Name) => {
    return [
        dep1Name, // receives `param 1` as value
        dep2Name, // receives `param 2` as value
        ++count
    ]
}

// register the factory
opium.registerFactory('factory', factory, ['dep1Name', 'dep2Name'])

var dep = opium.getDep('factory') // top level dep who's graph will be resolved
var injected = dep.inject()

console.log(injected[0], injected[1], injected[2])
```

### The Dependency object

Any dependency registered with `opium` is wrapped in a `Dependency` object that provides a very basic set of metadata, and methods to manipulate it.

The most important method is `inject`. Whenever `inject` is called on a `Dependency`, its dependency graph is immediately resolved and all its dependencies are properly injected.

Depending on its life cycle, a dependency might be resolved once and cached for each subsequent call, or resolved every time `inject` is called. In the case on `SINGLETON` the result of calling `inject` is cached, in the case of `PROTOTYPE` no caching is done, and the resolution happens on every invocation.

It's important to understand, that the result of the invocation is cached, not the type/factory/instance. For example calling inject on a `type` with `PROTOTYPE` life cycle will create a new instance every time, however calling a `factory` with `SINGLETON` life cycle will cache the result of invoking the factory function and return the same result over and over again.

In most cases interacting with the `Dependency` object will only happen once - when a top level dependency is resolved from the container and it's `inject()` method is invoked. This will suffice to trigger the dependency graph resolution and no subsequent interactions with it are required after the fact. It is however useful to expose it as it allows building more sophisticated or specialized dependency resolvers. In other words, it is most useful for framework creators who want to extend opium IoC with their own wiring conventions, for example those that want to have the dependency declarations in a `json` based config or, use it to power some decorator (`@inject`) syntax based approach, in languages that support it such as typescript and such.

### Types of Dependencies

`Opium` is built around the assumption of three common types of dependencies. These dependency types are:

- `type` - a `new`able `class` or `function`, it receives other dependencies through the constructor - known as constructor injection.
- `factory` - a factory method (can be `async`) that receives other dependencies as arguments and can perform more sophisticated instantiation - known as argument injection.
- `instance` - an object that is registered as is, no instantiation is performed, it receives its dependencies as properties on the registered object - known as property injection.

There are three corresponding methods for registering each dependency type:

- `registerType` - registers a `type` dependency.
- `registerFactory` - registers a `factory` dependency.
- `registerInstance` - registers an `instance` dependency.

In addition to dependency types, `opium` also assumes two types of dependency life cycle:

- `SINGLETON` - instantiated and injected only once on each `inject()` method invocation on the dependency.
- `PROTOTYPE` - instantiated and injected on each `inject()` method invocation on the dependency.

## API

### Opium class

#### *opium.getDep()*

Get a dependency from the IoC context. Returns a `Dependency` object, who's `inject` method can be called. Usually, this is the entry point to resolve a top level dependency graph.

#### *opium.inject()*

Triggers injection of all dependencies registered with that IoC context, by default resolution happens on a top level dependency, but in some cases it might be useful to resolve all dependencies in the the context. This could happen when there are more than one top level dependency.

#### *opium.deRegister()*

Remote a dependency from the IoC context.

#### *opium.registerType(`name`, `Type`, `[dependencies]`, `SINGLETON|PROTOTYPE`)*

A `type` is either a constructor function, or an ES6 class declaration. When a `type` dependency is registered, `opium` will create an instance and an pass all listed dependencies as constructor parameters, in effect performing constructor injection. Constructor parameters will be passed in the order of their declaration in the dependencies array.

#### *opium.registerFactory(`name`, `function(){}`, `[dependencies]`, `SINGLETON|PROTOTYPE`)*

When a `factory` dependency is registered, `opium` will invoke the factory and an pass all listed dependencies as function arguments, in effect performing argument injection.  Dependencies will be passed in the order of declaration in the dependencies array.

#### *opium.registerInstance(`name`, `Object.create()`, `[dependencies]`, `SINGLETON|PROTOTYPE`)*

When an `instance` dependency is registered, `opium` will look for, and set properties that match the name of dependencies listed in the dependencies array, in effect performing property injection. If the property is not defined, it will be defined by opium. _If debug logging is enabled a warning will be printed._

#### *opium.register(`name`, `dep,` `deps`, `injector`, `lifecycle`)*

This is the core method that all the `register*` methods call. In addition to the params that those methods expect, it also expects an instance  of an injector type. There are three default injector types that are used by each `register*` method respectively - `ArgumentInjector`, `ConstructorInjector` and `PropertyInjector`. Each of this injectors will treat the dependency in a well defined manner and would most likely not work correctly if mixed up. For example, although it will work, there are very few cases for setting properties on a bare types, if registered with a `PropertyInjector`.

Use this method, only if you know what you're doing, for all common cases the predefined injector/register pair should suffice.

### Dependency

#### *dependency.resolve()*

Return an array of `Dependencies` that this `Dependency` expects. The returned `Dependencies` might or might not be injected.

#### *dependency.inject()*

Triggers the `Dependency` graph resolution for this `Dependency` and all its `Dependencies`. Call this if you want to wire a single `Dependency`.
