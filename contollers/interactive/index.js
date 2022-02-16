// ! PREROBIŤ USER NOT FOUND CALLBACK NA REQUEST S ERROR HLÁSKOU USER NOT FOUND TRAY RESET !

const request = require('request')
const options = require('../../lib/options')
const helpers = require('../../lib/helpers')
const { validBookDateRanage } = require('./validate')

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

method.post_book_date = (data, callback) => {
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url

  if (!method.userExist(userId)) {
    method.initUser(userId)
  }

  user[userId].id = payload.user.id
  user[userId].name = payload.user.name

  if (validBookDateRanage(payload)) {
    // todo pridať validácie na usera či nemá booknutý dátum a čas
    // todo následne pridať ukladanie do databázy
    const prettyDate = helpers.formatDate(payload.actions[0].selected_date)
    const requestOptions = options.booking(prettyDate)

    requestOptions.url = responseUrl
    user[userId].date = payload.actions[0].selected_date
    method.postResponse(requestOptions, callback)
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
  // todo nezabudnúť na empty response ak bude všetko OK
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url

  if (method.userExist(userId)) {
    // todo pridať validácie na usera či nemá booknutý čas
    user[userId].clearTime()
    payload.actions[0].selected_options.forEach(ele => {
      user[userId].time.push(ele.value)
    })
  } else {
    callback(400, { Error: 'User does not exist' }, 'json')
  }
}

method.post_parking_place = (data, callback) => {
  // todo nezabudnúť na empty response ak bude všetko OK
  const payload = JSON.parse(data.body.payload)
  const userId = payload.user.id
  const responseUrl = payload.response_url

  if (method.userExist(userId)) {
    user[userId].parkingPlace = payload.actions[0].selected_option.value
  } else {
    callback(400, { Error: 'User does not exist' }, 'json')
  }
  console.log(user)
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
// const checkDate = (userId, callback) => {
//   _data.read('', 'booking', (err, bookingData) => {
//     if (!err && bookingData) {
//       const userCheck = bookingData.find(el => el.date === date && el.user_id === id)
//       if (userCheck) {
//         user[userId] = {}
//         options.datepicker('*You are already booked on this date*', 'https://code-planet.eu/images/warn.png')
//       } else {
//       }
//     } else {
//       // ! err file open
//     }
//   })
// }
// const tryBook = (userId, callback) => {
//   // !!!!! VALIDATIONS !!!!!
//   // * Basic user data
//   // * Check if user is already booked on selected date
//   // ? Check if parkingPlace is free on selected date
//   // ? Check if selected time is free on selected date

//   const { date, time, parkingPlace, id } = user[userId]

//   const checkDataValues = date && time && parkingPlace && id

//   if (checkDataValues) {
//     _data.read('', 'booking', (err, bookingData) => {
//       if (!err && bookingData) {
//         const userCheck = bookingData.find(el => el.date === date && el.user_id === id)
//         if (userCheck) {
//           user[userId] = {}
//           options.datepicker('*You are already booked on this date*', 'https://code-planet.eu/images/warn.png')
//         } else {
//         }
//       } else {
//         // ! err file open
//       }
//     })
//   } else {
//     callback('something went wrong')
//   }

//   // const data = {
//   //   date: user[userId].date,
//   //   time: user[userId].time,
//   //   place: user[userId].parkingPlace,
//   //   user_id: user[userId].id
//   // }
//   // _data.read('', 'booking', (err, bookingData) => {
//   //   if (!err && bookingData) {
//   //     bookingData.push(data)
//   //     _data.update('', 'booking', bookingData, err => {
//   //       if (err) {
//   //         callback(500, { Error: 'Could not update booking data' }, 'json')
//   //       }
//   //     })
//   //   } else {
//   //     callback(500, { Error: 'Could not update booking data' }, 'json')
//   //   }
//   // })
// }

// method.post = (data, callback) => {
//   const payload = JSON.parse(data.body.payload)

//   if (user[payload.user.id] === undefined) {
//     user[payload.user.id] = new User()
//   }

//   user[payload.user.id].id = payload.user.id
//   user[payload.user.id].name = payload.user.name

//   if (payload.actions[0].action_id === 'book_date') {
//     request.bookDate(payload)
//     user[payload.user.id].date = payload.actions[0].selected_date
//   } else if (payload.actions[0].action_id === 'reset_date') {
//     request.bookInit(payload.response_url)
//     user[payload.user.id] = {}
//   } else if (payload.actions[0].action_id === 'select_time') {
//     const value = []
//     payload.actions[0].selected_options.forEach(ele => {
//       value.push(ele.value)
//     })
//     user[payload.user.id].time = value
//   } else if (payload.actions[0].action_id === 'parking_place') {
//     user[payload.user.id].parkingPlace = payload.actions[0].selected_option.value
//   } else if (payload.actions[0].action_id === 'book_button') {
//     tryBook(payload.user.id, err => {
//       if (err) {
//         console.log(err)
//       }
//     })
//   }
//   // console.log(user)
//   callback(200, '', 'mpty')
// }

module.exports = method
