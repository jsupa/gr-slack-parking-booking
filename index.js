const server = require('./lib/server')
const helpers = require('./lib/helpers')

const config = require('./lib/config')

const app = {}

app.init = () => {
  if (config.allowWebServer === true) {
    server.init()
  } else {
    console.log(`[ ${helpers.getTime()} ] : Web server is disabled`)
  }
  // workers.init();
}

app.init()

module.exports = app
