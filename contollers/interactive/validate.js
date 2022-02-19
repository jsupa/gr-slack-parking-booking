const moment = require('moment')
const _data = require('../../lib/data')
const config = require('../../lib/config')

const validator = {}

validator.validBookDateRanage = data => {
  const selectedDate = moment(data.actions[0].selected_date).format('x')
  const minDate = moment().subtract(1, 'days').format('x')
  const maxDate = moment().add(5, 'days').format('x')
  const validDate = selectedDate >= minDate && selectedDate <= maxDate

  return validDate
}

validator.validBookingDateTime = data => {
  const userId = data.user.id
  const date = data.actions[0].selected_date
  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        const userCheck = bookingData.filter(el => el.date === date && el.user_id === userId)
        if (userCheck.length === 2) {
          resolve(false)
        } else if (userCheck.length === 1) {
          if (userCheck[0].time.length === 2) {
            resolve(false)
          } else {
            resolve(true)
          }
        } else {
          resolve(true)
        }
      } else {
        resolve(false)
        // ! err file open
      }
    })
  })
}

validator.validTimeDateAndParkingPlace = data => {
  const { date, time, parkingPlace } = data
  // todo dopísať error message na // ?
  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        const book = bookingData.filter(el => el.date === date && el.place === parkingPlace)
        if (book.length > 0 && time.length > 0) {
          if (book.length === 1 && book[0].time.length !== 2) {
            if (time.length === 1) {
              if (!book[0].time.filter(el => el === time[0])[0]) {
                resolve(true)
              } else {
                const freeTime = !book[0].time.filter(el => el === 'AM')[0] ? 'AM' : 'PM'
                resolve(
                  `*${
                    config.parkingPlaces[book[0].place.split('-')[1]]
                  } is free only at ${freeTime}, you have selected ${
                    time[0]
                  }* (please select ${freeTime} if you want this place)`
                )
              }
            } else {
              const freeTime = !book[0].time.filter(el => el === 'AM')[0] ? 'AM' : 'PM'
              resolve(
                `*${
                  config.parkingPlaces[book[0].place.split('-')[1]]
                } is free only at ${freeTime}, you have selected 2 times [${time}]* (you can only book ${freeTime} on this place)`
              ) // ? book == 1 máš 2 časy takže passe zase :p
            }
          } else {
            resolve(
              `*The ${
                config.parkingPlaces[book[0].place.split('-')[1]]
              } place is already reserved for the whole day* (please select another)`
            )
          }
        } else if (time.length === 0) {
          resolve('Please select time')
        } else {
          resolve(true) // ! nie je book na daný deň takže free to user
        }
      } else {
        resolve(false)
        // ! err file open
      }
    })
  })
}

module.exports = validator
