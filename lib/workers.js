const request = require('request')
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
  const date = helper.formatDate(data.actions[0].selected_date)
  const option = options.booking(date)
  option.url = url

  request(option, (error, response) => {
    if (error) throw new Error(error)
    return response.body
  })
}

module.exports = requests
