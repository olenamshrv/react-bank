class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.data = data
    this.isUsed = false
  }

  static generateCode = () => {
    return Math.trunc(Math.random() * 9000) + 1000
  }

  static createConfirm = (data) => {
    const newLength = Confirm.#list.push(new Confirm(data))

    setTimeout(() => {
      this.deleteCode(Confirm.#list[newLength - 1].code)
      console.log(this.#list)
    }, 1000 * 60 * 60 * 24)
  }

  static deleteCode = (code) => {
    this.#list = this.#list.filter(
      (item) => code !== item.code,
    )
  }

  static getData = (code) => {
    const confirm = this.#list.find(
      (item) => item.code === Number(code),
    )

    return confirm ? confirm : null
  }

  static setIsUsed = (confirm) => {
    confirm.isUsed = true
  }

  static getList = () => {
    return this.#list
  }
}

module.exports = { Confirm }
