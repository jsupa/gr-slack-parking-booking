// ! PREROBIŤ USER NOT FOUND CALLBACK NA REQUEST S ERROR HLÁSKOU USER NOT FOUND TRAY RESET !

const request = require('request')
const options = require('../../lib/options')
const helpers = require('../../lib/helpers')
const { validBookDateRanage, validBookingDateTime } = require('./validate')

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

  if (!method.userExist(userId)) {
    method.initUser(userId)
  }

  user[userId].id = payload.user.id
  user[userId].name = payload.user.name

  if (validBookDateRanage(payload)) {
    if (await validBookingDateTime(payload)) {
      // todo následne pridať ukladanie do databázy
      user[userId].date = payload.actions[0].selected_date
      const prettyDate = helpers.formatDate(payload.actions[0].selected_date)
      const requestOptions = await options.booking(prettyDate, user[userId])
      // // todo spraviť dynamicky zobrazovať len miesta a časy kde je volné
      // ? HOTVOKA ✅
      requestOptions.url = responseUrl
      method.postResponse(requestOptions, callback)
    } else {
      const requestOptions = options.datepicker(
        '*You already have a reservation for the selected day.* (please select another day)',
        'https://code-planet.eu/images/warn.png'
      )

      requestOptions.url = responseUrl
      method.postResponse(requestOptions, callback)
    }
  } else {
    const requestOptions = options.datepicker(
      '*Invalid date = ranage from today + 5 days*',
      'https://code-planet.eu/images/warn.png'
    )

    requestOptions.url = responseUrl
    method.postResponse(requestOptions, callback)
  }
}

method.post_reset_date = (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const responseUrl = payload.response_url
  const requestOptions = options.datepicker()

  requestOptions.url = responseUrl
  method.postResponse(requestOptions, callback)
}

method.post_select_time = (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  // const responseUrl = payload.response_url

  if (method.userExist(userId)) {
    // // todo pridať validácie na usera či nemá booknutý čas
    // ? nemal by si vedieť cez "GUI" zadať ne kokot čas
    user[userId].clearTime()
    payload.actions[0].selected_options.forEach(ele => {
      user[userId].time.push(ele.value)
    })

    callback(200, '', 'mpty')
  } else {
    callback(400, { Error: 'User does not exist' }, 'json')
  }
}

method.post_parking_place = (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  // const responseUrl = payload.response_url
  // ? použije sa pri validáciach

  if (method.userExist(userId)) {
    // todo validácia či neni miesto obsadené v danom čase
    user[userId].parkingPlace = payload.actions[0].selected_option.value
    callback(200, '', 'mpty')
  } else {
    callback(400, { Error: 'User does not exist' }, 'json')
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

method.postResponse = (options, callback) => {
  request(options, error => {
    if (error) callback(500, { Error: 'Something went wrong', message: error }, 'json')
    callback(200, '', 'mpty')
  })
}

module.exports = method
