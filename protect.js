export const Protect = (BaseClass, ClassType) => {
  switch (String(ClassType).toLowerCase()) {
    case 'private':
      return class PrivateClass extends BaseClass {
        constructor() {
          super()

          this.__Version__ = 1

          this.__ClassID__ = btoa(`${
            new Date()
              .toString()
            }${
            this.__Version__
            }${
            document.title}${this.name
            }`
            .replace(/[^A-Z0-9]/ig, "_")
          )

          this.__ProtectedID__ = '_$'

          this.__AccessEvent__ = new EventTarget

          this.__AccessEvent__.addEventListener('AccessFalse', event => {

            this.__ProtectedAccess__ = false
          })

          this.__AccessEvent__.addEventListener('AccessTrue', event => {

            this.__ProtectedAccess__ = true
          })

          this.__AccessEvent__.False = new Event('AccessFalse')

          this.__AccessEvent__.True = new Event('AccessTrue')

          this.__ProtectedAccess__ = false


          this[this.__ProtectedID__] = results => {

            const __Remit__ = results
            this.__AccessEvent__.dispatchEvent(this.__AccessEvent__.False)
            return __Remit__
          }

          if (this.__Log__) {

            this.__Log__ = {
              Name: this.__ClassID__,
              Error: (error, event) => {
                throw new Error(`${error} ${event}`)
              }
            }

            this.__Log__.open = window
              .indexedDB
              .open(
                this.__Log__.name,
                this.__Version__,
              )

            this.__Log__.open.onerror = event => {

              this.__Log__.Error('Failed to open indexedDB', event)
            }

            this.__Log__.open.onsuccess = event => {

              this.__Log__.db = event.target.result
            }
          }

          this.__ReferenceError__ = (
            property,
            message = 'Protect properties may not be accessed or set from outside of its original context:'
          ) => {

            throw new ReferenceError(`${message} ${property}`)
          }

          this.__TypeError__ = (property, type) => {

            throw new TypeError(`${
              typeof property === 'string' ?
                property :
                property.name
              } must be of type: ${
              typeof type === 'string' ?
                type :
                typeof type
              }`)
          }

          this.__ParameterCheck__ = (name, parameter, type) => {

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

          this.__ProtectCheck__ = (property) => {

            if (
              property.indexOf(this.__ProtectedID__) === 0 ||
              property.indexOf('__') === 0
            ) return true

            return false
          }

          this.__Protected__ = {
            Methods: [],
            Properties: []
          }

          Object
            .getOwnPropertyNames(this)
            .filter(
              property => {

                if (this.__ProtectCheck__(property)) {

                  if (this.__ParameterCheck__(property, this[property], 'function'))
                    this.__Protected__.Methods.push(property)

                  this.__Protected__.Properties.push(property)
                }

                return
              }
            ),

            this.__Handler__ = {
              apply: (target, thisArg, argumentsList) => {
                consoel.log('hey')
              },

              get: (target, property) => {

                if (
                  this.__Protected__.Properties.includes(property) &&
                  !this.__ProtectedAccess__
                )
                  this.__ReferenceError__(property)

                if (
                  this.__Protected__.Methods.includes(property) &&
                  !this.__ProtectedAccess__
                )
                  this.__ReferenceError__(property)

                if (
                  this.__ParameterCheck__(
                    property,
                    this[property],
                    'function'
                  )
                ) {

                  this.__ProtectedAccess__ = true

                  const __Method__ = this[property]

                  const __ArgTypes__ = __Method__({ _$: true })

                  return (...args) => {

                    if (args.length === 0)
                      this.__ReferenceError__(
                        property,
                        'You must provide an object of named arguments in'
                      )

                    Object.keys(args[0]).map(arg => {

                      if (!this.__ParameterCheck__(arg, args[0][arg], __ArgTypes__.types[arg]))
                        this.__TypeError__(arg, __ArgTypes__.types[arg])
                    })

                    return __Method__.apply(this, [...args, this.__ProtectedID__])
                  }
                }


                return this[property]
              },

              set: (target, property, value) => {

                if (this.__ProtectCheck__(property)) this.__ReferenceError__(property)

                return this[property] = value
              }
            }

          if (this.__Debug__) console.info('__Protected__', this.__Protected__)

          return new Proxy(this, this.__Handler__)
        }
      }
    case 'protected':
    return
    default:
    return
  }
}