// ! PREROBIŤ USER NOT FOUND CALLBACK NA REQUEST S ERROR HLÁSKOU USER NOT FOUND TRAY RESET !

const request = require('request')
const options = require('../../lib/options')
const helpers = require('../../lib/helpers')
const { validBookDateRanage, validBookingDateTime, validTimeDateAndParkingPlace } = require('./validate')

const method = {}
const user = {}

class User {
  constructor() {
    this.id = ''
    this.name = ''
    this.time = []
    this.parkingPlace = ''
    this.date = ''
  }

  reset() {
    this.time = []
    this.parkingPlace = ''
    this.date = ''
  }

  clearTime() {
    this.time = []
  }
}

method.post_book_date = async (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url
  const prettyDate = helpers.formatDate(payload.actions[0].selected_date)

  if (!method.userExist(userId)) {
    method.initUser(userId)
  }

  user[userId].id = payload.user.id
  user[userId].name = payload.user.name
  user[userId].clearTime()
  user[userId].date = payload.actions[0].selected_date

  if (validBookDateRanage(payload)) {
    if (await validBookingDateTime(payload)) {
      // todo následne pridať ukladanie do databázy
      const requestOptions = await options.booking(prettyDate, user[userId])

      requestOptions.url = responseUrl
      method.postResponse(requestOptions)
      callback(200, '', 'mpty')
    } else {
      // const requestOptions = options.datepicker(
      //   '*You already have a reservation for the selected day.* (please select another day)',
      //   'https://code-planet.eu/images/warn.png'
      // )

      // requestOptions.url = responseUrl
      // method.postResponse(requestOptions)
      // callback(200, '', 'mpty')

      const requestOptions = await options.onlyShowParkingPlace(user[userId], prettyDate)
      requestOptions.url = responseUrl
      method.postResponse(requestOptions)

      callback(200, '', 'mpty')
    }
  } else {
    const requestOptions = options.datepicker(
      '*Invalid date = ranage from today + 5 days*',
      'https://code-planet.eu/images/warn.png'
    )

    requestOptions.url = responseUrl
    method.postResponse(requestOptions)
    callback(200, '', 'mpty')
  }
}

method.post_reset_date = (data, callback) => {
  const payload = JSON.parse(data.body.payload)

  if (method.userExist(payload.user.id)) {
    user[payload.user.id].reset()
  }

  const responseUrl = payload.response_url
  const requestOptions = options.datepicker()

  requestOptions.url = responseUrl
  method.postResponse(requestOptions)
  callback(200, '', 'mpty')
}

method.post_select_time = (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url

  if (method.userExist(userId)) {
    // // todo pridať validácie na usera či nemá booknutý čas
    // ? nemal by si vedieť cez "GUI" zadať ne kokot čas
    user[userId].clearTime()
    payload.actions[0].selected_options.forEach(ele => {
      user[userId].time.push(ele.value)
    })

    callback(200, '', 'mpty')
  } else {
    const requestOptions = options.datepicker(
      'Session expired, please try again',
      'https://code-planet.eu/images/warn.png'
    )
    requestOptions.url = responseUrl
    method.postResponse(requestOptions)
    callback(200, '', 'mpty')
  }
}

method.post_parking_place = async (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url
  // ? použije sa pri validáciach

  if (method.userExist(userId)) {
    user[userId].parkingPlace = payload.actions[0].selected_option.value
    // todo validácia či neni miesto obsadené v danom čase
    const valid = await validTimeDateAndParkingPlace(user[userId])
    if (valid === true) {
      const save = await helpers.saveBooking(user[userId])
      if (save === true) {
        const webHookOptions = await options.bookedNotif(user[userId])
        webHookOptions.url = 'https://hooks.slack.com/services/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'
        method.postResponse(webHookOptions)

        delete user[payload.user.id]

        const requestOptions = options.datepicker(
          'The place has been booked',
          'https://code-planet.eu/images/question.png'
        )

        requestOptions.url = responseUrl
        method.postResponse(requestOptions)

        callback(200, '', 'mpty')
      }
      // ? callback že všetko sa uložilo a pošle sa textak že user si spravil rezerváciu :p
    } else {
      const prettyDate = helpers.formatDate(user[userId].date)
      const requestOptions = await options.booking(
        prettyDate,
        user[userId],
        valid,
        true,
        'https://code-planet.eu/images/warn.png'
      )

      requestOptions.url = responseUrl
      method.postResponse(requestOptions)
      callback(200, '', 'mpty')
    }
  } else {
    const requestOptions = options.datepicker(
      'Session expired, please try again',
      'https://code-planet.eu/images/warn.png'
    )
    requestOptions.url = responseUrl
    method.postResponse(requestOptions)
    callback(200, '', 'mpty')
  }
}

method.userExist = userId => {
  if (!user[userId]) {
    return false
  } else {
    return true
  }
}

method.initUser = userId => {
  user[userId] = new User()
}

method.postResponse = options => {
  request(options, error => {
    if (error) throw error
  })
}

module.exports = method
