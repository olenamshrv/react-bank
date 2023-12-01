class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateToken()
    this.user = {
      email: user.email,
      id: user.id,
      isConfirm: user.isConfirm,
    }
  }

  static generateToken = () => {
    const length = 6
    const characters =
      'ABCDEFGHIKLMNOPQRSTVXYZabcdefghiklmnopqrstvxyz0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      console.log()
      const randomIndex = Math.floor(
        (1 - Math.random()) * characters.length,
      )
      result += characters[randomIndex]
    }
    return result
  }

  static createSession(user) {
    const session = new Session(user)
    this.#list.push(session)
    return session
  }

  static getSession = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }

  static getSessionByEmail = (email) => {
    return (
      this.#list.find(
        (item) => item.user.email === email,
      ) || null
    )
  }

  static removeSession(email) {
    const session = this.getSessionByEmail(email)

    this.#list = this.#list.filter(
      (item) => item !== session,
    )
  }

  static getList() {
    return this.#list
  }
}

module.exports = { Session }
