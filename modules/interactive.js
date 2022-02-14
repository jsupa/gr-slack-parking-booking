const request = require('../lib/workers')

const method = {}

method.post = (data, callback) => {
  const payload = JSON.parse(data.body.payload)

  if (payload.actions[0].action_id === 'book_date') {
    request.bookDate(payload)
  } else if (payload.actions[0].action_id === 'reset_date') {
    request.bookInit(payload.response_url)
  }

  callback(200, '', 'mpty')
}

module.exports = method
