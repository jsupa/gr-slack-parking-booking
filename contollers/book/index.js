const request = require('request')
const options = require('../../lib/options')
const { isValid } = require('./validate')

const method = {}

method.post = (data, callback) => {
  if (isValid(data)) {
    const option = options.datepicker()
    option.url = data.body.response_url

    request(option, error => {
      if (error) callback(500, { Error: 'Could not get datepicker' }, 'json')
      callback(200, '', 'mpty')
    })
  } else {
    callback(400, { Error: 'Invalid data' }, 'json')
  }
}

module.exports = method
