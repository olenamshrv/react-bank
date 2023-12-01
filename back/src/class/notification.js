const NOTIFICATIONS_NAMES = {
  NEW_REWARD_SYSTEM: 'New reward system',
  NEW_LOGIN: 'New login',
  PAYMENT_RECEIVED: 'Payment received',
  PAYMENT_SENT: 'Payment sent',
}

const NOTIFICATIONS_TYPES = {
  ANNOUNCEMENT: 'Announcement',
  WARNING: 'Warning',
  PAYMENT_RECEIVED: 'Info',
}

class Notification {
  static #list = []
  static count = 0

  constructor(name, type, userId, transactionId = null) {
    this.id = ++Notification.count
    this.date = new Date().getTime()
    this.name = name
    this.type = type
    this.userId = userId
    this.transactionId =
      transactionId === null ? null : Number(transactionId)
  }

  static createNotification(
    name,
    type,
    userId,
    transactionId,
  ) {
    if (!Object.values(NOTIFICATIONS_TYPES).includes(type))
      return false
    if (!Object.values(NOTIFICATIONS_NAMES).includes(name))
      return false

    this.#list.push(
      new Notification(
        name,
        type,
        Number(userId),
        transactionId,
      ),
    )
  }

  static getList() {
    return this.#list
  }

  static getAllNotificationsByUser(userId) {
    return this.#list.filter(
      (item) => item.userId === userId,
    )
  }
}

module.exports = { Notification, NOTIFICATIONS_NAMES }
