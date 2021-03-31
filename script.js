import { Protect } from './protect.js'

const MyClass = Protect(class MyClass {

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

    console.log('this._privateMethod:', this._privateMethod())

    return `${string1} and ${string2}`
  }
})

const ProtectedClass = new MyClass

console.group('Protected')
console.log('publicProp:', ProtectedClass.publicProp)
console.log('publicMethod:', ProtectedClass.publicMethod({}))
console.log('publicMethod:', ProtectedClass.publicMethod({}))
console.log('typeCheckMethod:', ProtectedClass.typeCheckMethod({ string1: 'fdsfdsfds', string2:''}))
// console.log('_privateProp:', ProtectedClass._privateProp)
// console.log('_privateMethod:', ProtectedClass._privateMethod())
console.groupEnd()