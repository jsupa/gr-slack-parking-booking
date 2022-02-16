const moment = require('moment')

const validator = {}

validator.validBookDateRanage = data => {
  const selectedDate = moment(data.actions[0].selected_date).format('x')
  const minDate = moment().subtract(1, 'days').format('x')
  const maxDate = moment().add(5, 'days').format('x')
  const validDate = selectedDate >= minDate && selectedDate <= maxDate

  return validDate
}

module.exports = validator
