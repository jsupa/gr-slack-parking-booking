const moment = require('moment')

const helpers = {}

helpers.getTime = function () {
  const result = moment().format('MMMM Do YYYY - H:mm:ss')
  return result
}

helpers.getTimestamp = function () {
  const result = moment().format('x')
  return parseInt(result, 10)
}

helpers.getMinutes = function () {
  const result = moment().format('mm')
  return parseInt(result, 10)
}

module.exports = helpers
