import { Protect } from './protect.js'

const MyClass = Protect( class MyClass {

  constructor() {
    this.publicProp = true
    this._$protectedProp = true
  }

  publicMethod() {

    return true
  }

  _$protectedMethod() {

    return true
  }

  typeCheckMethod({ string1, string2, _$ }) {

    if (_$) return {
      types: {
        string1: 'string',
        string2: 'string',
      }
    }

    return this._$(`${string1} and ${string2}`)
  }
},'private')

const ProtectedClass = new MyClass

console.log(ProtectedClass.publicProp)
console.log(ProtectedClass.publicMethod({ string1: {}, string2: 3 }))
console.log(ProtectedClass.typeCheckMethod({ string1: {}, string2: 3 }))
// console.log(ProtectedClass.typeCheckMethod({ string1: {}, string2: 3 }))
// console.log(ProtectedClass.typeCheckMethod({ string1: {}, string2: 3 }))
// console.log(ProtectedClass.typeCheckMethod({ string1: {}, string2: 3 }))
// console.log(ProtectedClass._$protectedProp)

