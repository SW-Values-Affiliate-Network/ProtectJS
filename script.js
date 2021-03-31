import { Protect } from './protect.js'

class MyClass {

  constructor() {

    this.publicProp = true
    this._privateProp = true
  }

  publicMethod() {

    return true
  }

  _privateMethod() {

    return true
  }

  typeCheckMethod( { string1, string2, _$ = false } ) {

    if ( _$ ) return { 
      types:{
        string1 : 'string',
        string2 : 'string',
      }
    }

    return `${ string1 } and ${ string2 }`
  }
}

const UnProtected = new MyClass

MyClass = Protect( MyClass )

const ProtectedClass = new MyClass

console.group(`UnProtected`)
console.log(`publicProp`,UnProtected.publicProp)
console.log(`publicMethod`, UnProtected.publicMethod())
console.log(`_privateProp`,UnProtected._privateProp)
console.log(`_privateMethod`,UnProtected._privateMethod())
console.groupEnd()

console.group(`Protected`)
console.log(`publicProp`,ProtectedClass.publicProp)
console.log(`publicMethod`,ProtectedClass.publicMethod({}))
// console.log(`publicMethod`,ProtectedClass.publicMethod())
console.log(`_privateProp`,ProtectedClass._privateProp)
console.log(`_privateMethod`,ProtectedClass._privateMethod())
console.groupEnd()