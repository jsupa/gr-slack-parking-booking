const moment = require('moment')
const _data = require('../../lib/data')

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
        const timeCompare = (a1, a2) => JSON.stringify(a1) === JSON.stringify(a2)
        const userCheck = bookingData.find(
          el => el.date === date && el.user_id === userId && timeCompare(el.time, ['AM', 'PM'])
        )

        resolve(!userCheck)
      } else {
        resolve(false)
        // ! err file open
      }
    })
  })
}

module.exports = validator
