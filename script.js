import { Protect } from './protect.js'

let CalcApp = Protect(
  class CalcApp {
    constructor() {
      this._$Interface__= {}
    }

    add(number1,number2) {
      return number1 + number2
    }
  }
)

CalcApp = new CalcApp

CalcApp.add()