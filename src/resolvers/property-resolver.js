'use strict'

const Resolver = require('./resolver')

class PropResolver extends Resolver {
  /**
   * Construct property resolver
   *
   * @param {Injector} injector - Injector instance to be used
   * @param {string} propName - Property name
   */
  constructor (injector, propName = '$inject') {
    super(injector)

    this.propName = propName
  }

  /**
   * Resolve dependency names
   *
   * @param {object} obj - Object to resolve property for
   * @returns {*}
   */
  resolve (obj) {
    if (!(this.propName in obj)) {
      console.info(`Undefined object or no injector property "${this.propName}" found!`)
      return
    }

    return obj[this.propName]
  }
}

module.exports = PropResolver
