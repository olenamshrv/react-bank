class Balance {
  static #list = []

  constructor(email, amount, up) {
    this.email = String(email).toLowerCase()
    this.balance = up ? Number(amount) : -Number(amount)
  }

  static createBalance = (email, amount, up) => {
    this.#list.push(new Balance(email, amount, up))
  }

  static findUserBalance = (email) => {
    return this.#list.find(
      (item) => item.email === String(email),
    )
  }

  static getBalanceAmount = (email) => {
    return this.findUserBalance(email).balance
  }

  static updateUserBalance = (email, amount, up) => {
    const balance = this.findUserBalance(email)

    if (!balance) {
      this.createBalance(email, amount, up)
    } else {
      up
        ? (balance.balance += Number(amount))
        : (balance.balance -= Number(amount))
    }
  }

  static getList = () => this.#list

  static updateEmail(oldEmail, newEmail) {
    this.findUserBalance(oldEmail).email = newEmail
  }
}

class Transaction {
  static #list = []
  static count = 0

  constructor(
    sender = null,
    receiver = null,
    amount,
    paymentSystemId = null,
  ) {
    this.id = ++Transaction.count
    this.date = new Date().getTime()
    this.sender =
      sender === null ? null : String(sender).toLowerCase()
    this.receiver = String(receiver).toLowerCase()
    this.amount = Number(amount)
    this.paymentSystemId =
      paymentSystemId === null
        ? null
        : Number(paymentSystemId)
  }

  static createTransaction = (
    sender = null,
    receiver = null,
    amount,
    paymentSystemId = null,
  ) => {
    if (paymentSystemId != null) {
      this.#list.push(
        new Transaction(
          null,
          receiver,
          amount,
          paymentSystemId,
        ),
      )

      Balance.updateUserBalance(receiver, amount, true)
    } else {
      if (sender && receiver) {
        this.#list.push(
          new Transaction(sender, receiver, amount, null),
        )

        Balance.updateUserBalance(receiver, amount, true)
        Balance.updateUserBalance(sender, amount, false)
      }
    }

    return this.#list[this.#list.length - 1].id
  }

  static getAllUserTransactions = (email) => {
    return this.#list
      .filter(
        (transaction) =>
          transaction.receiver ===
            String(email).toLowerCase() ||
          transaction.sender ===
            String(email).toLowerCase(),
      )
      .reverse()
  }

  static updateEmail(oldEmail, newEmail) {
    this.getAllUserTransactions(oldEmail).forEach(
      (item) => {
        if (item.sender === oldEmail) {
          item.sender = newEmail
        }
        if (item.receiver === oldEmail) {
          item.receiver = newEmail
        }
      },
    )
  }

  static getList = () => this.#list

  static getTransactionById = (id) => {
    return this.#list.find(
      (transaction) => transaction.id === id,
    )
  }
}

module.exports = { Balance, Transaction }
