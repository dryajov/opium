Opium - DI for the masses.

## Opium

`Opium` is a dependency injection framework for javascript. The aim of `opium` is to provide the simplest possible and yet functionally complete dependency injection solution.  `Opium`'s main feature is its lack of assumptions around dependency declaration techniques; such as XML, JSON or a DSL. Instead, opium relies on a clean and non opinionated api, that leaves the door open to use you're own style/technique for declaring dependencies.

#### Getting started
`npm install --save opium-ioc`

#### Usage

##### es6
```javascript
import {
    Opium, 
    SINGLETON, 
    PROTOTYPE
} from 'opium-ioc';

opium.registerInstance('param1', 'param 1');
opium.registerInstance('param2', 'param 2');

let count = 0;
factory = function (param1, param2) {
    return [param1, param2, ++count];
}

opium.registerFactory('factory', factory, ['param1', 'param2']);

let dep = opium.getDep('factory');
let injected = dep.inject();

console.log(injected[0], injected[1], injected[2])

```

##### es5
```javascript
var Opium = require('opium-ioc').Opium;
var SINGLETON = require('opium-ioc').SINGLETON;
var PROTOTYPE = require('opium-ioc').PROTOTYPE;

var opium = new Opium();
opium.registerInstance('param1', 'param 1');
opium.registerInstance('param2', 'param 2');

let count = 0;
factory = function (param1, param2) {
    return [param1, param2, ++count];
}

opium.registerFactory('factory', factory, ['param1', 'param2']);

var dep = opium.getDep('factory');
var injected = dep.inject();

console.log(injected[0], injected[1], injected[2])

```

#### Types of Dependencies

`Opium` is built around the assumption of three common types of dependencies. These dependency types are - `type`,  `factory` and `instance`.  There are three corresponding methods for registering each dependency type - `registerType`, `registerFactory` and `registerInstance`.  

In addition to dependency types, `opium` also assumes two types of dependency lifecycle -  `SINGLETON` and `PROTOTYPE`. `SINGLETON` dependencies are instantiated and injected only once, `PROTOTYPE` dependencies are instantiated and injected on each `inject()` method invocation on the dependency.

#### Dependency

Any dependency registered with `opium` is wrapped in a `Dependency` object, that provides a very basic set of metadata, and methods to manipulate it. The most important method is `inject`. Whenever `inject`is called on a `Dependency`, its dependency graph is immediately resolved and all its dependencies are properly injected. Depending on its lifecycle, a dependency might be resolved once and cached for each subsequent call, or resolved every time `inject` is called. In the case on `SINGLETON` the result of calling `inject`is cached, in the case of `PROTOTYPE` no caching is done, and the resolution happens on every invocation. 

It's important to understand, that the result of the invocation is cached, not the type/factory/instance. For example calling inject on a `type` with `PROTOTYPE` lifecycle will create a new instance every time, however calling a `factory` with `SINGLETON` lifecycle will cache the result of invoking the factory function and return the same result over and over again. 

### Resolvers
A resolver is a helper class that allows specifying your own wiring logic.                      For example, you might want to have a JSON or an XML document describe how dependencies are wired, and bypass the programmatic API altogether.                                                      
                                                                                                            
There are two phases, `register` and `resolve`. 
                                                                                                            
By default, register maps a `register*` method to a type of dependency.
The dependency types are - TYPE, FACTORY, INSTANCE and are looked up in the option's object type property that is passed to `register`. `Register` will call `resolve` just before performing registration of the dependency, and it expects an array of dependency names to be returned by it.           
                                                                                                            
This model should be flexible enough to allow writing resolvers for different needs and scenarios. The api has been intentionally left very generic to allow extensibility, and cater to as many different needs as possible. However, this is not considered a core part of the framework, and is provided for convenience mostly. Consider defining your own set of resolvers if this does not fit into your existing model, or using  the programmatic API directly.

For an example of an existing resolver take a look at [property-resolver.js](https://github.com/dryajov/opium/blob/master/app/scripts/resolvers/property-resolver.js)


### API


#### Opium


##### opium.registerType(`name`, `Type`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

A `type` is either a constructor function, or an es6 class declaration. When a `type` dependency is registered, `opium` will try to create an instance and an pass all listed dependencies as constructor parameters, in effect performing constructor injection. Constructor parameters will be passed in the order of their declaration in the dependencies array.

##### opium.registerFactory(`name`, `function(){}`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

When a `factory` dependency is registered, `opium` will try to invoke the factory and an pass all listed dependencies as function arguments, in effect performing argument injection.  Dependencies will be passed in the order of declaration in the dependencies array.

##### opium.registerInstance(`name`, `Object.create()`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

When an `instance` dependency is registered, `opium` will look for, and set properties that match the name of dependencies listed in the dependencies array, in effect performing property injection. 

#### opium.register(`name`, `dep,` `deps`, `injector`, `lifecycle`)

This is the core method that all the `register*` methods call. In addition to the params that those methods expect, it also expects an instance  of an injector type. There are three default injector types that are used by each `register*` method respectively - `ArgumentInjector`, `ConstructorInjector` and `PropertyInjector`. Each of this injectors will treat the dependency in a well defined manner, and would most likely not work correctly if mixed up. For example, although it will work, there are very few cases for setting properties on a bare function, if registered with a `PropertyInjector`, and unless your constructor function is designed to be called without `this`, it will probably not behave as expected when invoked directly with apply, by registering it with an `ArgumentInjector` instead of the expected `ConstructorInjector`. However, this also allows you to create your own injectors, by specializing one of the existing ones, or writing one from scratch. 

Use this method, only if you know what you're doing, for all common cases the predefined injector/register pair should suffice.

##### opium.inject()

Triggers injection of all dependencies registered with that context, by default resolution happens on demand.


### Dependency

#### dependency.resolve()
Return an array of `Dependencies` that this `Dependency` expects. The returned `Dependencies` might or might not be injected.

#### dependency.inject()

Triggers the `Dependency` graph resolution for this `Dependency` and all its `Dependencies`. Call this if you want to wire a single `Dependency`.


### Resolver

#### register(`name`, `dep`, `options = {}`)

Register a dependency.

#### resolve(`dep`)

Resolve dependency names from the passed in dependency. By default, its called right before registering a dependency by the register method.
