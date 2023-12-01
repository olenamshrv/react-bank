const express = require('express')
const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const {
  Balance,
  Transaction,
} = require('../class/transaction')
const { PaymentSystem } = require('../class/paymentSystem')
const {
  Notification,
  NOTIFICATIONS_NAMES,
} = require('../class/notification')

User.create({
  email: 'test@email.com',
  password: '1',
}).isConfirm = true

User.create({
  email: 'test2@email.com',
  password: '123',
}).isConfirm = true

User.create({
  email: 'test3@email.com',
  password: '123',
}).isConfirm = true

User.create({
  email: 'test4@email.com',
  password: '123',
}).isConfirm = true

// console.log(User.getList())

Transaction.createTransaction(
  'test@email.com',
  'test2@email.com',
  150.0,
  null,
)

Transaction.createTransaction(
  'test@email.com',
  'test3@email.com',
  520.55,
  null,
)

Transaction.createTransaction(
  null,
  'test@email.com',
  1570.89,
  1,
)

Transaction.createTransaction(
  null,
  'test@email.com',
  12330.12,
  2,
)

Transaction.createTransaction(
  null,
  'test3@email.com',
  157.02,
  2,
)

// Transaction.createTransaction(
//   'test2@email.com',
//   'test@email.com',
//   20.31,
//   null,
// )

// Transaction.createTransaction(
//   null,
//   'test@email.com',
//   590.6,
//   2,
// )

// Transaction.createTransaction(
//   null,
//   'test@email.com',
//   1420.23,
//   2,
// )

// Transaction.createTransaction(
//   'test@email.com',
//   'test4@email.com',
//   190.34,
//   null,
// )

// Transaction.createTransaction(
//   'test3@email.com',
//   'test@email.com',
//   555.55,
//   null,
// )

// Transaction.createTransaction(
//   'test@email.com',
//   'test4@email.com',
//   339.89,
//   null,
// )

// Transaction.createTransaction(
//   'test2@email.com',
//   'test3@email.com',
//   850.12,
//   null,
// )

// console.log('transaction list', Transaction.getList())

// console.log('balance list', Balance.getList())

const stripe = PaymentSystem.create('Stripe', [
  'mastercard',
  'greencard',
  'bitcoin',
  'redcard',
  'bluecard',
  'binance',
  'mastercard',
])
const coinbase = PaymentSystem.create('Coinbase', [
  'greencard',
  'mastercard',
  'redcard',
  'bitcoin',
  'binance',
  'bluecard',
])

// console.log('PaymentSystem', PaymentSystem.getList())

Notification.createNotification(
  'Payment received',
  'Info',
  1,
  4,
)

Notification.createNotification(
  'Payment sent',
  'Info',
  2,
  1,
)

Notification.createNotification(
  'New reward system',
  'Announcement',
  1,
  null,
)

Notification.createNotification(
  'New login',
  'Warning',
  1,
  null,
)

Notification.createNotification(
  'Payment received',
  'Info',
  1,
  4,
)

Notification.createNotification(
  'Payment sent',
  'Info',
  2,
  1,
)

Notification.createNotification(
  'New reward system',
  'Announcement',
  1,
  null,
)

Notification.createNotification(
  'New login',
  'Warning',
  1,
  null,
)

Notification.createNotification(
  'Payment received',
  'Info',
  1,
  4,
)

Notification.createNotification(
  'Payment sent',
  'Info',
  2,
  1,
)

Notification.createNotification(
  'New reward system',
  'Announcement',
  1,
  null,
)

Notification.createNotification(
  'New login',
  'Warning',
  1,
  null,
)

// console.log(
//   'Notification.getList()',
//   Notification.getList(),
// )

// console.log(Notification.getAllNotificationsByUser(1))

console.log('sessions', Session.getList())

//==============================================================

router.post('/signup', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message:
        'An error has occurred. The required fields are missing.',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'An error has occurred. The user already exists.',
      })
    }

    const newUser = User.create({ email, password })
    const session = Session.createSession(newUser)

    Confirm.createConfirm(newUser.email)
    console.log(Confirm.getList())

    return res.status(200).json({
      message: 'The user has been registered successfully.',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message:
        'An error has occurred while creating a user.',
    })
  }
})

//==============================================================

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message:
        'The error has occurred. The required fields are missing.',
    })
  }

  try {
    const session = Session.getSession(token)

    if (!session) {
      return res.status(400).json({
        message:
          'The error has occurred. You are not logged in.',
      })
    }

    const confirm = Confirm.getData(Number(code))

    if (!confirm) {
      return res.status(400).json({
        message: 'Code does not exist',
      })
    }

    const { data } = confirm

    if (data !== session.user.email) {
      return res.status(400).json({
        message: 'Code is not valid',
      })
    }

    session.user.isConfirm = true

    const user = User.getByEmail(session.user.email)
    user.isConfirm = true

    Confirm.setIsUsed(confirm)

    return res.status(200).json({
      message: 'Your email has been confirmed.',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/login', function (req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({
      message:
        'The error has occurred. The required fields are missing.',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'The user with given email does not exist.',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message:
          'The error has occurred. The password does not fit.',
      })
    }

    Session.removeSession(email)
    const session = Session.createSession(user)

    return res.status(200).json({
      message:
        'Your login has been completed successfully.',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/recovery', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message:
        'The error has occurred. The required fields are missing.',
    })
  }

  try {
    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message:
          'The user with the given email does not exist.',
      })
    }

    Confirm.createConfirm(email)

    console.log(Confirm.getList())

    return res.status(200).json({
      message: 'The code has been sent.',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/recovery-confirm', function (req, res) {
  const { password, code } = req.body

  if (!password || !code) {
    return res.status(400).json({
      message:
        'The error has occurred. The required fields are missing.',
    })
  }

  try {
    const confirmData = Confirm.getData(Number(code))

    if (!confirmData) {
      return res.status(400).json({
        message: 'The code does not exist.',
      })
    }

    const { isUsed, data } = confirmData

    if (isUsed === true) {
      return res.status(400).json({
        message: 'The code has been already used.',
      })
    }

    const user = User.getByEmail(data)

    if (!user) {
      return res.status(400).json({
        message:
          'The user with the email address provided does not exist.',
      })
    }

    user.password = password

    const session = Session.createSession(user)

    session.user.isConfirm = true
    user.isConfirm = true
    Confirm.setIsUsed(confirmData)

    return res.status(200).json({
      message:
        'The password change has been completed successfully.',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.get('/balance', function (req, res) {
  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({
        message: "It is necessary to send a user's id",
      })
    }

    const email = User.getById(Number(id)).email

    if (!email) {
      return res.status(400).json({
        message:
          "A user's email has not been found by its id",
      })
    }

    const list = Transaction.getAllUserTransactions(email)
    const userBalance = Balance.findUserBalance(email)

    let balance
    if (userBalance) balance = userBalance.balance

    return res.status(200).json({
      list: list.map(
        ({
          id,
          date,
          sender,
          receiver,
          amount,
          paymentSystemId,
        }) => ({
          id: id,
          date: date,
          name:
            paymentSystemId === null
              ? sender === email
                ? receiver
                : sender
              : PaymentSystem.getName(
                  Number(paymentSystemId),
                ),
          type: sender === email ? 'Sending' : 'Receipt',
          amount,
          paymentSystemId: paymentSystemId,
        }),
      ),
      balance: balance ? `${balance}` : null,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//===================================================================

router.get('/transaction', function (req, res) {
  try {
    const { userId, transactionId } = req.query

    if (!userId) {
      return res.status(400).json({
        message: "It is necessary to send a user's id",
      })
    }

    const email = User.getById(Number(userId)).email

    if (!email) {
      return res.status(400).json({
        message:
          "A user's email has not been found by its id",
      })
    }

    if (!transactionId) {
      return res.status(400).json({
        message: 'It is necessary to send transactionId',
      })
    }

    const transaction = Transaction.getTransactionById(
      Number(transactionId),
    )

    if (!transaction) {
      return res.status(400).json({
        message:
          'A transaction with such ID does not exist',
      })
    }

    let address, type

    if (transaction.paymentSystemId === null) {
      if (email === transaction.sender) {
        address = transaction.receiver
        type = 'Sending'
      } else {
        address = transaction.sender
        type = 'Receipt'
      }
    } else {
      address = PaymentSystem.getName(
        Number(transaction.paymentSystemId),
        (type = 'Receipt'),
      )
    }

    console.log('address, type', address, type)

    return res.status(200).json({
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        date: transaction.date,
        address: address,
        type: type,
      },
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//===================================================================

router.get('/receive', function (req, res) {
  try {
    return res.status(200).json({
      list: PaymentSystem.getList().map(
        ({ id, name, logos }) => ({
          id: Number(id),
          name: name,
          logos: logos,
        }),
      ),
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/receive', function (req, res) {
  const { email, receiveAmount, paymentSystemId } = req.body

  console.log(
    'email, receiveAmount, paymentSystemId',
    email,
    receiveAmount,
    paymentSystemId,
  )

  if (!email || email === 'undefined') {
    return res.status(400).json({
      message:
        'The error has occurred. Please provide an email.',
    })
  }

  try {
    const transactionId = Transaction.createTransaction(
      PaymentSystem.getName(Number(paymentSystemId)),
      email,
      receiveAmount,
      paymentSystemId,
    )

    console.log(
      'Notification.getList()',
      Notification.getList(),
    )

    return res.status(200).json({
      transactionId: transactionId,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.get('/user', function (req, res) {
  const { email } = req.query

  if (!email) {
    return res.status(400).json({
      message: "It is necessary to send a user's email",
    })
  }

  try {
    return res.status(200).json({
      id: User.getByEmail(email).id,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//===================================================================

router.post('/send', function (req, res) {
  const { userId, email, sum } = req.body

  if (!userId) {
    return res.status(400).json({
      message:
        "It is necessary to send a user's (sender's) id",
    })
  }

  const senderEmail = User.getById(Number(userId)).email

  if (!senderEmail) {
    return res.status(400).json({
      message:
        "A user's (sender's) email has not been found by its id",
    })
  }

  if (!email || email === 'undefined') {
    return res.status(400).json({
      message:
        'The error has occurred. Please provide an email of receiver.',
    })
  }

  if (!User.getByEmail(email)) {
    return res.status(400).json({
      message:
        'The error has occurred. The user with the provided email does not exist in the system.',
    })
  }

  if (email === senderEmail) {
    return res.status(400).json({
      message:
        "The error has occurred. An email of receiver must differ from the sender's email.",
    })
  }

  if (!sum) {
    return res.status(400).json({
      message:
        'The error has occurred. Please provide a sum for sending.',
    })
  }

  if (sum <= 0 || sum > 10000) {
    return res.status(400).json({
      message:
        'The error has occurred. Please provide a correct value of sum (must be positive and less than $10000)',
    })
  }

  const balance = Number(
    Balance.getBalanceAmount(senderEmail),
  )

  const convertedBalance = Number(balance).toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
    },
  )

  const convertedSum = Number(sum).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  if (sum > balance) {
    return res.status(400).json({
      message: `The specified sum (${convertedSum}) exceeds the amount of balance (${convertedBalance}).`,
    })
  }

  try {
    const transactionId = Transaction.createTransaction(
      senderEmail,
      email,
      sum,
      null,
    )

    return res.status(200).json({
      transactionId: transactionId,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//===================================================================

router.get('/notifications', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({
      message: "It is necessary to send a user's id",
    })
  }

  const user = User.getById(Number(id))

  if (!user) {
    return res.status(400).json({
      message: `The user with the id=${Number(
        id,
      )} does not exist.`,
    })
  }

  try {
    return res.status(200).json({
      list: Notification.getAllNotificationsByUser(
        Number(id),
      )
        .map(({ id, name, date, type }) => ({
          id: Number(id),
          name: name,
          date: date,
          type: type,
        }))
        .reverse(),
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/notifications', function (req, res) {
  const { name, type, userId, transactionId } = req.body

  if (!userId || !name || !type) {
    return res.status(400).json({
      message:
        'The error has occurred. The required fields are missing.',
    })
  }

  try {
    Notification.createNotification(
      name,
      type,
      Number(userId),
      Number(transactionId),
    )

    switch (name) {
      case NOTIFICATIONS_NAMES.PAYMENT_RECEIVED:
      case NOTIFICATIONS_NAMES.PAYMENT_SENT:
        message =
          'The transfer has been completed successfully.'
        break
      default:
        message = 'The notification has been sent.'
    }

    return res.status(200).json({
      message: message,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//==============================================================

router.post('/settings-change-email', function (req, res) {
  const { oldEmail, newEmail, password } = req.body

  if (!oldEmail || !newEmail || !password) {
    return res.status(400).json({
      message:
        'An error has occurred. The required fields are missing.',
    })
  }

  if (oldEmail === newEmail) {
    return res.status(400).json({
      message:
        'An error has occurred. The email is the same.',
    })
  }

  try {
    const user = User.getByEmail(oldEmail)

    if (!user) {
      return res.status(400).json({
        message:
          'The user with the email address provided does not exist.',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message:
          'The error has occurred. The password does not fit.',
      })
    }

    user.changeFieldValue('email', newEmail)
    const session = Session.createSession(user)
    Session.removeSession(oldEmail)
    Transaction.updateEmail(oldEmail, newEmail)
    Balance.updateEmail(oldEmail, newEmail)

    return res.status(200).json({
      message:
        'The email address has been changed successfully.',
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message:
        'An error has occurred while changing an email address.',
    })
  }
})

//==============================================================

router.post(
  '/settings-change-password',
  function (req, res) {
    const { email, newPassword, oldPassword } = req.body

    if (!email || !newPassword || !oldPassword) {
      return res.status(400).json({
        message:
          'An error has occurred. The required fields are missing.',
      })
    }

    try {
      const user = User.getByEmail(email)

      if (!user) {
        return res.status(400).json({
          message:
            'The user with the email address provided does not exist.',
        })
      }

      if (user.password !== oldPassword) {
        return res.status(400).json({
          message:
            'The error has occurred. The old password does not fit.',
        })
      }

      user.changeFieldValue('password', newPassword)
      const session = Session.createSession(user)
      Session.removeSession(email)

      return res.status(200).json({
        message:
          'The password has been changed successfully.',
        session,
      })
    } catch (error) {
      return res.status(400).json({
        message:
          'An error has occurred while changing a password.',
      })
    }
  },
)

//==============================================================

router.post('/logout', function (req, res) {
  const { email } = req.body

  if (!email) {
    return res.status(400).json({
      message:
        'The error has occurred. The email is missing.',
    })
  }

  const user = User.getByEmail(email)

  if (!user) {
    return res.status(400).json({
      message: 'The user with given email does not exist.',
    })
  }

  try {
    Session.removeSession(email)

    return res.status(200).json({
      message: 'You have successfully logged out.',
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
