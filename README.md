Opium - DI for the masses.

## Opium

`Opium` is a dependency injection framework for javascript. The aim of `opium` is to provide the simplest possible and yet functionally complete dependency injection solution.  `Opium`'s main feature is its lack of assumptions around dependency declaration techniques; such as XML, JSON or a DSL. Instead, opium relies on a clean and non opinionated api, that leaves the door open to use you're own style/technique for declaring dependencies.

#### Getting started
`npm install --save opium-ioc`

#### Usage

```
import Opium from 'opium-ioc';
import {SINGLETON, PROTOTYPE} from 'opium-ioc/consts';

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

#### Types of Dependencies

`Opium` is built around the assumption of there common types of dependencies. These dependency types are - `type`,  `factory` and `instance`.  There are three corresponding methods for registering each dependency type - `registerType`, `registerFactory` and `registerInstance`.  

In addition to dependency types, `opium` also assumes two types of dependency lifecycle -  `SINGLETON` and `PROTOTYPE`. `SINGLETON` dependencies are instantiated and injected only once, `PROTOTYPE` dependencies are instantiated and injected on each `inject()` method invocation on the dependency.

#### Dependency

Any dependency registered with `opium` is wrapped in a `Dependency` object, that provides a very basic set of metadata, and methods to manipulate it. The most important method is `inject`. Whenever `inject`is called on a `Dependency`, its dependency graph is immediately resolved and all its dependencies are properly injected in cascading order. Depending on its lifecycle, a dependency might be resolved once and cached for each subsequent call, or resolved every time `inject` is called. In the case on `SINGLETON` the result of calling `inject`is cached, in the case of `PROTOTYPE` no caching is done, and the resolution happens on every invocation. 

It's important to understand, that the result of the invocation is cached, not the type/factory/instance. For example calling inject on a `type` with `PROTOTYPE` lifecycle will create a new instance every time, however calling a `factory` with `SINGLETON` lifecycle will cache the result of invoking the factory function and return the same result over and over again. 

#### API


##### opium.registerType(`name`, `Type`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

A `type` is either a constructor function, or an es6 class declaration. When a `type` dependency is registered, `opium` will try to create an instance and an pass all listed dependencies as constructor parameters, in effect performing constructor injection. Constructor parameters will be passed in the order of their declaration in the dependencies array.

##### opium.registerFactory(`name`, `function(){}`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

When a `factory` dependency is registered, `opium` will try to invoke the factory and an pass all listed dependencies as function arguments, in effect performing argument injection.  Dependencies will be passed in the order of declaration in the dependencies array.

##### opium.registerInstance(`name`, `Object.create()`, `['optional', 'list', 'of', 'dependencies']`, `SINGLETON|PROTOTYPE`)

When an `instance` dependency is registered, `opium` will look for, and set properties that match the name of dependencies listed in the dependencies array, in effect performing property injection. 

