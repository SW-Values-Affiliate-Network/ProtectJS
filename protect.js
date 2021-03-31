export const Protect = BaseClass => class ProtectClass extends BaseClass {

  constructor() {

    super()

    this.__ReferenceError__ = (property, message = `Private properties may not be accessed or set:`) => {

      throw new ReferenceError(`${message} ${property}`)
    }

    this.__TypeError__ = (property, type) => {

      throw new TypeError(`${typeof property === 'string' ? property : property.name} must be of type: ${typeof type === 'string' ? type : typeof type}`)
    }

    this.__ParameterCheck__ = (name, parameter, type) => {

      if (!parameter) return false

      if (
        typeof parameter === String(type) ||
        typeof type === 'object' &&
        parameter instanceof type
      )
        return parameter

      this.__TypeError__(name, type)
    }

    this.__Private__ = {

      Properties: Object
        .getOwnPropertyNames(this)
        .filter(
          property => {

            if (property.indexOf('_') === 0) return property

            return
          }
        ),

      Methods: Object
        .getOwnPropertyNames(BaseClass.prototype)
        .filter(
          property => {

            if (property.indexOf('_') === 0) return property

            return
          }
        ),
    }

    this.__PrivateCheck__ = (property) => {

      if (
        property.indexOf('_') === 0 ||
        property in this.__Private__ &&
        !this.__PrivateAccess__
      ) {

        this.__ReferenceError__(property)
      }

      try {

        if (typeof this[property] === 'function') { this.__PrivateAccess__ = true }
      } catch (error) {

        this.__ReferenceError__(property)
      }

      return true
    }

    this.__Handler__ = {

      get: (target, property) => {
        if (this.__PrivateCheck__(property)) {

          if (typeof this[property] === 'function') {

            const __Method__ = target[property]

            return (...args) => {

              if (args.length === 0)
                this.__ReferenceError__(property, `You must provide an object of named arguments in`)

              const FunctionString = String(this[property])

              if (FunctionString.match(/\{\n+\s+if \(\_\$\) return/gm)) {

                const argTypes = this[property]({ _$: true })

                Object.keys(args[0]).map(arg => {
                  this.__ParameterCheck__(arg, args[0][arg], argTypes.types[arg])
                })
              }

              let __Result__ = __Method__.apply(this, args)

              return __Result__
            }
          }

          return this[property]
        }

        this.__ReferenceError__(property)
      },

      set: (target, property, value) => {

        if (this.__PrivateCheck__(property)) return Reflect(this[property] = value)

        this.__ReferenceError__(property)
      }
    }

    if (this.Debug) console.info('__Private__', this.__Private__)

    return new Proxy(this, this.__Handler__)
  }
}