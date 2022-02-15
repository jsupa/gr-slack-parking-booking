const request = require('request')
const moment = require('moment')

const options = require('./options')
const helper = require('./helpers')

const requests = {}

requests.bookInit = url => {
  const option = options.datepicker()

  option.url = url

  request(option, (error, response) => {
    if (error) throw new Error(error)
    return response.body
  })
}

requests.bookDate = data => {
  const url = data.response_url
  const date = data.actions[0].selected_date
  const seldate = moment(date).format('x')
  const minDate = moment().subtract(1, 'days').format('x')
  const maxDate = moment().add(5, 'days').format('x')
  const validDate = seldate >= minDate && seldate <= maxDate
  const formatDate = helper.formatDate(data.actions[0].selected_date)
  let option

  if (validDate) {
    option = options.booking(formatDate)
  } else {
    option = options.datepicker('*Invalid date > ranage from today + 5 days*', 'https://code-planet.eu/images/warn.png')
  }
  option.url = url

  request(option, (error, response) => {
    if (error) throw new Error(error)
    return response.body
  })
}

module.exports = requests
