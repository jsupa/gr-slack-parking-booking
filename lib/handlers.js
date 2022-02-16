const book = require('../contollers/book')
const interactive = require('../contollers/interactive')

const handlers = {}

handlers.index = (data, callback) => {
  if (data.method === 'get') {
    callback(200, { status: 'ok' }, 'json')
  } else {
    callback(400, undefined, 'html')
  }
}

handlers.book = (data, callback) => {
  const acceptableMethods = ['post']

  if (acceptableMethods.indexOf(data.method) > -1) {
    book[data.method](data, callback)
  } else {
    callback(405, { statis: '405', messages: 'Method Not Allowed' }, 'json')
  }
}

handlers.event = (data, callback) => {
  callback(200, data.body, 'json')
}

handlers.interactive = (data, callback) => {
  const acceptableMethods = ['post']
  const payload = JSON.parse(data.body.payload)
  const actionId = payload.actions[0].action_id

  if (acceptableMethods.indexOf(data.method) > -1) {
    interactive[`${data.method}_${actionId}`](data, callback)
  } else {
    callback(405, { statis: '405', messages: 'Method Not Allowed' }, 'json')
  }
}

handlers.ping = (data, callback) => {
  callback(200, 'pong', 'plain')
}

handlers.notFound = (data, callback) => {
  callback(404, { status: '404', messages: 'Not Found' }, 'json')
}

module.exports = handlers
