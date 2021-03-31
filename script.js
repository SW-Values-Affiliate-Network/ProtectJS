import { Protect } from './protect.js'

const MyClass = Protect(
  class MyClass {

    constructor() {
      this._$Log__ = false
      this._$Debug__ = false
      this.publicProp = true
      this._$privateProp = true
    }

    publicMethod() {

      return true
    }

    _$privateMethod() {

      return true
    }

    typeCheckMethod({ string1, string2, _$ }) {

      if (_$) return {
        types: {
          string1: 'string',
          string2: 'string',
        }
      }

      console.log('this._privateMethod:', this._privateMethod())

      return `${string1} and ${string2}`
    }
  }
)

const ProtectedClass = new MyClass