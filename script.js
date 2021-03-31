import { Protect } from './protect.js'

class MyClass {

  constructor() {
    this.Debug = true
    this.publicProp = true
    this._privateProp = true
  }

  publicMethod() {

    return true
  }

  _privateMethod() {

    return true
  }

  typeCheckMethod({ string1, string2, _$ }) {

    if (_$) return {
      types: {
        string1: 'string',
        string2: 'string',
      }
    }

    return `${string1} and ${string2}`
  }
}

MyClass = Protect(MyClass)

const ProtectedClass = new MyClass

console.group(`Protected`)
console.log(`publicProp`, ProtectedClass.publicProp)
console.log(`publicMethod`, ProtectedClass.publicMethod({}))
console.log(`publicMethod`, ProtectedClass.publicMethod())
console.log(`_privateProp`, ProtectedClass._privateProp)
console.log(`_privateMethod`, ProtectedClass._privateMethod())
console.groupEnd()