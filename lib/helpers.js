const moment = require('moment')

const helpers = {}

helpers.parseJsonToObject = data => {
  try {
    const parsedData = JSON.parse(data)
    return parsedData
  } catch (e) {
    return {}
  }
}

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

module.exports = helpers
