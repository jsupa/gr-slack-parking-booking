const request = require('../lib/workers')

const method = {}

method.get = (data, callback) => {
  // console.log(data.queryStringObject);
  callback(200, { Status: 'Get pineapple' })
}

method.post = (data, callback) => {
  request.bookInit(data.body.response_url)
  callback(200, '', 'mpty')
}

module.exports = method
