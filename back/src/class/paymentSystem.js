class PaymentSystem {
  static #list = []
  static count = 0

  constructor(name, logos) {
    this.id = ++PaymentSystem.count
    this.name = name
    this.logos = [...new Set(logos)]
  }

  static create(name, logos) {
    this.#list.push(new PaymentSystem(name, logos))
  }

  static getName(id) {
    return this.#list.find((system) => system.id === id)
      .name
  }

  static getList() {
    return this.#list
  }
}

module.exports = { PaymentSystem }
