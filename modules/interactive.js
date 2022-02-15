const request = require('../lib/workers')

const method = {}

const user = {}

class User {
  constructor() {
    this.id = ''
    this.name = ''
    this.time = []
    this.parkingPlace = ''
  }
}

method.post = (data, callback) => {
  const payload = JSON.parse(data.body.payload)

  if (user[payload.user.id] === undefined) {
    user[payload.user.id] = new User()
  }

  user[payload.user.id].id = payload.user.id
  user[payload.user.id].name = payload.user.name

  if (payload.actions[0].action_id === 'book_date') {
    request.bookDate(payload)
  } else if (payload.actions[0].action_id === 'reset_date') {
    request.bookInit(payload.response_url)
    user[payload.user.id] = {}
  } else if (payload.actions[0].action_id === 'select_time') {
    const value = []
    payload.actions[0].selected_options.forEach(ele => {
      value.push(ele.value)
    })
    user[payload.user.id].time = value
  } else if (payload.actions[0].action_id === 'parking_place') {
    user[payload.user.id].parkingPlace = payload.actions[0].selected_option.value
  }
  console.log(user)
  callback(200, '', 'mpty')
}

module.exports = method
