export const Protect = BaseClass => class ProtectClass extends BaseClass {

  constructor() {

    super()

    this._$Version__ = this._$Version__ || 1

    this._$ClassID__ = this._$ClassID__ || btoa(`${this._$Version__}:${document.title}:${BaseClass.name}`)

    this._$ProtectedID__ = this._$ProtectedID__ || '_$'

    if (this._$Log__) {

      this._$Log__ = {
        Name: this._$ClassID__,
        Error: ((error, event) => {
          throw new Error(`${error} ${event}`)
        })()
      }

      this._$Log__.open = window
        .indexedDB
        .open(
          this._$Log__.name,
          this._$Version__,
        )

      this._$Log__.open.onerror = event => {

        this._$Log__.Error('Failed to open indexedDB', event)
      }

      this._$Log__.open.onsuccess = event => {

        this._$Log__.db = event.target.result
      }
    }



    this.__ReferenceError__ = (property, message = 'Private properties may not be accessed or set:') => {

      throw new ReferenceError(`${message} ${property}`)
    }

    this.__TypeError__ = (property, type) => {

      throw new TypeError(`${typeof property === 'string' ? property : property.name} must be of type: ${typeof type === 'string' ? type : typeof type}`)
    }

    this.__ParameterCheck__ = (name, parameter, type) => {

      if (typeof parameter === 'undefined' || parameter.length === 0) return false

      if (
        typeof parameter === String(type) ||
        typeof type === 'object' &&
        parameter instanceof type
      )
        return true

      return false
    }

    this.__ProtectCheck__ = (property) => {

      this.__ProtectAccess__ = this.__ParameterCheck__(property, this[property], 'function')

      if (property.indexOf(this._$ProtectedID__) === 0 || property.indexOf('__') === 0)
        return true

      return false
    }

    this.__Protect__ = {

      Properties:
        Object
          .getOwnPropertyNames(this)
          .filter(
            property => {

              if (this.__ProtectCheck__(property)) return property

              return
            }
          ),

      Methods:
        Object
          .getOwnPropertyNames(BaseClass.prototype)
          .filter(
            property => {

              if (this.__ProtectCheck__(property)) return property

              return
            }
          ),
    }

    this._$Handler__ = this._$Handler__ || {

      get: (target, property) => {

        if (this.__ProtectCheck__(property)) {

          if (this.__Protect__.Methods.includes(property)) {

            const __Method__ = target[property]

            return (...args) => {

              if (args.length === 0)
                this.__ReferenceError__(property, 'You must provide an object of named arguments in')

              this.__FunctionString__ = String(this[property])

              if (this.__FunctionString__.match(/\{\n+\s+if \(\_\$\) return/gm)) {

                const argTypes = this[property]({ _$: true })

                Object.keys(args[0]).map(arg => {
                  this.__ParameterCheck__(arg, args[0][arg], argTypes.types[arg])
                })
              }

              let __Result__ = __Method__.apply(this, args)

              return __Result__
            }
          }
          
          this.__ReferenceError__(property)
        }

        return this[property]
      },

      set: (target, property, value) => {

        if (this.__ProtectCheck__(property)) return Reflect(this[property] = value)

        this.__ReferenceError__(property)
      }
    }

    if (this._$Debug__) console.info('__Protect__', this.__Protect__)

    return new Proxy(this, this._$Handler__)
  }
}