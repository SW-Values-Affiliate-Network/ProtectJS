import { Protect } from './protect.js'

const MyClass = Protect(
  class MyClass {

    constructor() {
      this._$Log__ = false
      this._$Debug__ = true
      this.publicProp = true
      this._$protectedProp = true
    }

    publicMethod() {

      return true
    }

    _$protectedMethod() {

      return true
    }

    typeCheckMethod({ string1, string2 }) {

      // if (_$) return {
      //   types: {
      //     string1: 'string',
      //     string2: 'string',
      //   }
      // }

      // console.log('this._protectedMethod:', this._protectedMethod())

      return `${string1} and ${string2}`
    }
  }
)

const ProtectedClass = new MyClass

console.log(ProtectedClass.typeCheckMethod({string1:{}, string2: 3}))