const moment = require('moment')

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

module.exports = helpers
