const moment = require('moment')
const _data = require('./data')

const helpers = {}

helpers.getTime = () => {
  const result = moment().format('MMMM Do YYYY - H:mm:ss')
  return result
}

helpers.getTimestamp = () => {
  const result = moment().format('x')
  return parseInt(result, 10)
}

helpers.getMinutes = () => {
  const result = moment().format('mm')
  return parseInt(result, 10)
}

helpers.formatDate = date => moment(date).format('Do MMMM YYYY')
helpers.yesterday = () => moment().subtract(1, 'days').format('YYYY-MM-DD')

helpers.saveBooking = data => {
  const { date, time, parkingPlace, id } = data
  const newBook = {
    date,
    time,
    place: parkingPlace,
    user_id: id
  }
  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        bookingData.push(newBook)
        _data.update('', 'booking', bookingData, err => {
          if (!err) {
            resolve(true)
          } else {
            resolve('Could not save booking')
          }
        })
      } else {
        throw new Error('Could not read booking data', err)
      }
    })
  })
}

module.exports = helpers
