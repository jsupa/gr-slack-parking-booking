// const helpers = require('../lib/helpers')

const method = {}

method.get = (data, callback) => {
  // console.log(data.queryStringObject);
  callback(200, { Status: 'Get pineapple' })
}

method.post = (data, callback) => {
  console.log(data.body)
  callback(200, { status: 'ok' }, 'json')
}

module.exports = method
