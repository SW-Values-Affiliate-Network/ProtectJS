// Import in ProtectJS
import { Protect } from './protect.js'
/* 
- ProtectJS is a dynamic type checking and enforcement class decorator.
- A protected class can only be instanciated using the new reserved word.
- The first parameter must be a boolean value determining if the protected class can be extended.
- Protected methods and properties can be declared using double underscores ( __ ) at the beginning of their name.
*/
const Class = Protect( true, class Class {
    constructor() {

      // Debugging: You can enable debuging which will print out the class's protected properties and methods in the console.
      this.__Debug__ = true

      // Interface: Declare the class interface and method types.
      this.__Interface__ = {

        // Use the method name as a property of the interface.
        publicMethod: {

          // Before Effect: This function will run before the function called and will pass along it's returned results as an argument out side of name arguments object.
          __before: params => params,

          // After Effect: This function will run after the function called and will have the results of the called function as it's only argument. 
          __after: results => results,

          // Parameter Type Check: the named argment's name must be the key and the value must a value JS type. You may use *, any or do not specify the named argument as a property to disable type checking.
          string1: 'string',

          // Return Type Check: This is how you specifiy the type that must be returned from the function called. Before and after effects can return any type. 
          __return: 'string'
        },

        // Example of a protected method property declared within the interface. Same as above.
        __protectedMethod: {
          __before: params => params,
          __after: results => results,
          __return: 'function'
        },

        // This method does not take any arguments but you still need to specify the return type. 
        publicInterface: {
          __return:'object'
        }
      }

      // This property can be accessed outside of the class.
      this.publicProperty = true

      // This property is protected and can not be accessed outside of the class.
      this.__protectedProperty = false
    }

    // You can expose protected values but not set them out side of the classes context.
    publicInterface({}, bypass){
      console.log(bypass)
      return this.__Interface__
    }

    // This method can be access outside of the class.
    publicMethod({ string1 }, beforeEffectResult) {

      // Private methods and properties are accessible inside of public methods. 
      this.__protectedMethod({ before: beforeEffectResult })

      // Return type is set to string.
      return string1
    }

    // This method is not accessble outside of this class.
    __protectedMethod({ before }) {

      // Returns a function.
      return console.info('__protectedMethod', before)
    }
  }
)

/*
 Examples below:
*/ 
// You can instanciate a new of extand 
class Protected extends Class {
  constructor() {
    super()

    // In an extended class you inhereit the properties and methods but you can not set or change them.
    // this.publicProperty = false
  }
}

// Create new class to have access to extended methods and properties.
Protected = new Protected

// Grouping console logs for clarity.
console.group('Access Tests')

// Public methods and properties are accessible.
console.info('publicProperty',Protected.publicProperty)

// All methods must use named arguments or pass in an empty object.
console.info('publicMethod',Protected.publicMethod({string1:'some text'}))

// You can expose private properties through public functions and also choose to bypass the type checking system.
console.info('publicInterface',Protected.publicInterface({},'You can bypass the type checking system but you must still obey return types.'))

// Protected methods and properties are not accessible.
// console.info('__protectedProperty',Protected.__protectedProperty)
// console.info('__protectedMethod',Protected.__protectedMethod({before:'yo'}))
console.info('__Interface__',Protected.__Interface__)

// End console log grouping.
console.groupEnd()