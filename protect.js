// Protect - a function that takes a class as an argument and returns an immutable private class.
export const Protect = (BaseClass) => {

  // Check is argmuent is a class.
  if (BaseClass.prototype.constructor)

    // ProtectedClass - a new class using the argmuent class as a mixin.
    return class ProtectedClass extends BaseClass {

      // All functions and properties are declared in the constructor.
      constructor() {

        // Bring in all the methods and properties of the mixin class
        super()

        // __ProtectedAccess__ - protected method and property access.
        let __ProtectedAccess__ = false
        const __ErrorMessages__ = {
          type: {
            default: 'must return type',
            parameter: 'type does not exist or is not specified in the class interface',
            interface: 'types can not be determined. There must be an interface object declared in the class constuctor',
            effects: 'must be a function',
            arguments: 'must have an object of parameter types specified in the class interface',
          },
          reference: {
            default: 'Protected properties may not be accessed or set from outside of its parent class execution context',
            arguments: 'You must provide an object of named arguments in',
          },
          parameter: {

          },
          log: {
            openError: 'Failed to open indexedDB',

          }
        }

        // _Types__ - an array of all javascript types.
        const __Types__ = [
          'undefined',
          'boolean',
          'number',
          'string',
          'bigint',
          'symbol',
          'object',
          'function',
          'any',
          '*',
          'null'
        ]

        // __ClassName__ - the base class name.
        const __ClassName__ = this.name

        // __DateTime__ - today's date.
        const __DateTime__ = () => new Date().toString()

        // _$Version__ - the version number. 
        const _$Version__ = this._$Version__ || 1

        // __DocumentTitle__ - document title.
        const __DocumentTitle__ = document.title

        // __LastModified__ - the last modification date of this document.
        const __LastModified__ = document.lastModified

        // Create the class id as a base64 hash.
        const _$ClassID__ = this._$ClassID__ ||
          btoa(`${
            // Application or class version.
            _$Version__
            }:${
            // Title of document.
            __DocumentTitle__
            }:${
            // Name of base class.
            __ClassName__
            }`
            // Replace all special characters with an underscore.
            .replace(/[^A-Z0-9]/ig, "_")
          )

        // _$Debug__ - check and set debug mode.
        const _$Debug__ = this._$Debug__ === true

        // __IDBName__ - set the name of the indexeddb database.
        const __IDBName__ = `Protect-${__DocumentTitle__}`

        // __LogCheck__ - check and set log mode.
        const __LogCheck__ = this._$Log__ === true

        // Setup logging if enabled.
        if (__LogCheck__) {

          // _$Log__ - an object to handle logging.
          let _$Log__ = {
            // Name of log in indexedDB.
            idb: __IDBName__,
            // Specifiy log error. 
            Error: (error, event) => {
              throw new Error(`${error} ${event}`)
            }
          }

          // _$Log__.open - open a connection to indexDB and create a log for this class.
          _$Log__.open = indexedDB
            .open(
              _$Log__.idb,
              _$Version__,
            )

          // _$Log__.close - closes a connection to indexDB.
          _$Log__.close =

            // _$Log__.open.onerror - upgrade handler.
            _$Log__.open.onupgradeneeded = event => {

              _$Log__.db = target.result
              _$Log__.store = _$Log__
                .db
                .createObjectStore(
                  `Log-Store-${_$ClassID__}`,
                  { keyPath: 'logid' }
                )
            }

          // _$Log__.open.onerror - error handle.
          _$Log__.open.onerror = event => {

            _$Log__.Error(__ErrorMessages__.log.openError, event)
          }

          // $Log__.open.onsuccess - success handler. 
          _$Log__.open.onsuccess = ({ target }) => {

            _$Log__.db = target.result
          }
        }

        // __ReferenceError__ - a custom reference error.
        const __ReferenceError__ = (
          property,
          message = __ErrorMessages__.reference.default
        ) => {

          throw new ReferenceError(`${message}: ${property}`)
        }

        // __TypeError__ a custom type error.
        const __TypeError__ = (
          property,
          type,
          message = __ErrorMessages__.type.default
        ) => {

          throw new TypeError(`${
            // typeof property === 'string' - print if property is a string and if it is not print it's name.
            typeof property === 'string' ?
              property :
              property.name
            } ${message}: ${
            // typeof type === 'string' - print if type is a string and if it is not print it's type.
            typeof type === 'string' ?
              type :
              typeof type
            }`)
        }

        // __ParameterCheck__ - a way to check types and parameters.
        const __ParameterCheck__ = (name, parameter, type) => {

          //  !__Types__.includes(type) - check if type is a valid type included in the __Types__ array.
          if (!__Types__.includes(type))

            // Throw type error
            __TypeError__(name, type, __ErrorMessages__.type.parameter)

          // type === '*' || type === 'any' - ignore check the type.
          if (type === '*' || type === 'any')
            return true

          if (
            typeof parameter === 'undefined' ||
            parameter.length === 0
          ) return false

          if (
            typeof parameter === String(type) ||
            typeof type === 'object' &&
            parameter instanceof type
          )
            return true

          return false
        }

        const __ProtectCheck__ = (property) => {

          if (
            property.indexOf('_$') === 0 ||
            property.indexOf('__') === 0
          ) return true

          return false
        }

        let __Protect__ = {
          Methods: [],
          Properties: []
        }

        Object
          .getOwnPropertyNames(this)
          .filter(
            property => {

              if (__ProtectCheck__(property)) {

                if (__ParameterCheck__(property, this[property], 'function'))
                  __Protect__.Methods.push(property)

                __Protect__.Properties.push(property)
              }

              return
            }
          )

        const __Protected__ = Object.freeze(__Protect__)

        const __Handler__ = this.__Handler__ || {

          get: (target, property) => {

            if (
              __Protected__.Properties.includes(property) &&
              !__ProtectedAccess__
            )
              __ReferenceError__(property)

            if (
              __Protected__.Methods.includes(property) &&
              !__ProtectedAccess__
            )
              __ReferenceError__(property)

            if (
              __ParameterCheck__(
                property,
                this[property],
                'function'
              )
            ) {

              __ProtectedAccess__ = true

              const __Method__ = this[property]

              if (this._$Interface__ && Object.keys(this._$Interface__).length !== 0) {

                const __ArgTypes__ = this._$Interface__[property]

                let _$

                if (__ArgTypes__._$before && !__ParameterCheck__('_$before', __ArgTypes__._$before, 'function')) {

                  __TypeError__('_$before', __ArgTypes__._$before, __ErrorMessages__.type.effects)
                } else {
                
                  _$.before = __ArgTypes__._$before || false
                }

                if (__ArgTypes__._$after && !__ParameterCheck__('_$after', __ArgTypes__._$after, 'function')) {
                
                  __TypeError__('_$after', __ArgTypes__._$after, __ErrorMessages__.type.effects)
                } else {
                
                  _$.after = __ArgTypes__._$after || false
                }


              } else {
                __TypeError__(property, 'undefined', __ErrorMessages__.type.interface)
              }

              if (!__ArgTypes__)
                __TypeError__(property, 'undefined', __ErrorMessages__.type.arguments)

              return (...args) => {

                if (args.length === 0)
                  __ReferenceError__(
                    property,
                    __ErrorMessages__.reference.arguments
                  )

                const __ArgumentCallBack__ = _$.after || false

                Object.keys(args[0]).map(arg => {

                  if (!__ParameterCheck__(arg, args[0][arg], __ArgTypes__[arg]))
                    __TypeError__(arg, __ArgTypes__[arg], __ErrorMessages__.type.parameter)
                })

                let __ApplyArgs__ = [...args]

                if (_$.before) {
                  const __$BeforeResults__ = {
                    _$: _$.before(...args)
                  }
                  __ApplyArgs__ = [...args, __$BeforeResults__]
                }

                let __Results__ = __Method__
                  .apply(
                    this,
                    __ApplyArgs__
                  )

                if (
                  __ArgumentCallBack__ &&
                  __ArgTypes__._$return &&
                  !__ParameterCheck__(
                    '_$return',
                    __ArgumentCallBack__(__Results__),
                    __ArgTypes__._$return
                  )
                )
                  __TypeError__(
                    property,
                    __ArgTypes__._$return,
                    __ErrorMessages__.type.effects
                  )

                if (__ArgumentCallBack__)
                  __Results__ = __ArgumentCallBack__(__Results__)

                __ProtectedAccess__ = false

                return __Results__

              }
            }

            return this[property]
          },

          set: (target, property, value) => {

            if (__ProtectCheck__(property)) __ReferenceError__(property)

            return this[property] = value
          }
        }

        if (_$Debug__) console.info('__Protected__', __Protected__)

        return Object.freeze(Object.seal(Object.preventExtensions(new Proxy(this, __Handler__))))
      }
    }
  return new TypeError(`You must provide a class: ${BaseClass.name || 'undefined'}`)
}
