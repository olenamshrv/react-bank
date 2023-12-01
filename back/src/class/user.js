class User {
  static #list = []

  static #count = 1

  constructor({ email, password }) {
    this.id = Number(User.#count++)
    this.email = String(email).toLowerCase()
    this.password = String(password)
    this.isConfirm = false
  }

  static create(data) {
    const user = new User(data)
    this.#list.push(user)

    return user
  }

  static getByEmail(email) {
    return (
      this.#list.find(
        (user) =>
          user.email === String(email).toLowerCase(),
      ) || null
    )
  }

  changeFieldValue(name, value) {
    if (name === 'email')
      this.email = String(value).toLowerCase()

    if (name === 'password') this.password = String(value)
  }

  static getById(id) {
    return (
      this.#list.find((user) => user.id === Number(id)) ||
      null
    )
  }

  static getList = () => this.#list
}

module.exports = {
  User,
}
