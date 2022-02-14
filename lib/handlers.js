const book = require('../modules/book')
const interactive = require('../modules/interactive')

const handlers = {}

handlers.index = (data, callback) => {
  if (data.method === 'get') {
    callback(200, { status: 'ok' }, 'json')
  } else {
    callback(400, undefined, 'html')
  }
}

handlers.book = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete']
  if (acceptableMethods.indexOf(data.method) > -1) {
    book[data.method](data, callback)
  } else {
    callback(405, { statis: '405', messages: 'Method Not Allowed' }, 'json')
  }
}
handlers.event = (data, callback) => {
  console.log(data)
  callback(200, data.body, 'json')
}
handlers.interactive = (data, callback) => {
  const acceptableMethods = ['post']
  if (acceptableMethods.indexOf(data.method) > -1) {
    interactive[data.method](data, callback)
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
