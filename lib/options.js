const helper = require('./helpers')
const config = require('./config')
const _data = require('./data')

const options = {}

options.genParkingPlace = (userData, onlyText) => {
  const { date } = userData
  const elementsRadioButtons = []

  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        const parking = bookingData.filter(el => el.date === date)

        config.parkingPlaces.forEach((place, index) => {
          const bookedPlace = parking.filter(el => el.place === `parking-${index}`)

          if (bookedPlace.length === 1) {
            if (onlyText === true) {
              elementsRadioButtons.push({
                type: 'plain_text',
                text: `${bookedPlace[0].time.length === 2 ? ':red_circle:' : ':large_orange_circle:'} - ${place} => <@${
                  bookedPlace[0].user_id
                }> booked ${bookedPlace[0].time.length === 2 ? 'all day' : `at ${bookedPlace[0].time}`}`,
                emoji: true
              })
            } else {
              elementsRadioButtons.push({
                text: {
                  type: 'plain_text',
                  text: `${
                    bookedPlace[0].time.length === 2 ? ':red_circle:' : ':large_orange_circle:'
                  } - ${place} => <@${bookedPlace[0].user_id}> booked ${
                    bookedPlace[0].time.length === 2 ? 'all day' : `at ${bookedPlace[0].time}`
                  }`,
                  emoji: true
                },
                value: `parking-${index}`
              })
            }
          } else if (bookedPlace.length === 2) {
            if (bookedPlace[0].user_id === bookedPlace[1].user_id) {
              if (onlyText === true) {
                elementsRadioButtons.push({
                  type: 'plain_text',
                  text: `:red_circle: - ${place} => <@${bookedPlace[0].user_id}> booked all day`,
                  emoji: true
                })
              } else {
                elementsRadioButtons.push({
                  text: {
                    type: 'plain_text',
                    text: `:red_circle: - ${place} => <@${bookedPlace[0].user_id}> booked all day`,
                    emoji: true
                  },
                  value: `parking-${index}`
                })
              }
            } else if (onlyText === true) {
              elementsRadioButtons.push({
                type: 'plain_text',
                text: `:red_circle: - ${place} => <@${bookedPlace[0].user_id}> booked at ${bookedPlace[0].time} and <@${bookedPlace[1].user_id}> booked at ${bookedPlace[1].time}`,
                emoji: true
              })
            } else {
              elementsRadioButtons.push({
                text: {
                  type: 'plain_text',
                  text: `:red_circle: - ${place} => <@${bookedPlace[0].user_id}> booked at ${bookedPlace[0].time} and <@${bookedPlace[1].user_id}> booked at ${bookedPlace[1].time}`,
                  emoji: true
                },
                value: `parking-${index}`
              })
            }
          } else if (onlyText === true) {
            elementsRadioButtons.push({
              type: 'plain_text',
              text: `:free: - ${place}`,
              emoji: true
            })
          } else {
            elementsRadioButtons.push({
              text: {
                type: 'plain_text',
                text: `:free: - ${place}`,
                emoji: true
              },
              value: `parking-${index}`
            })
          }
        })
        resolve(elementsRadioButtons)
      } else {
        // ! err file open
      }
    })
  })
}

options.genMessage = (userData, defMessage, importantMessage) => {
  const { id, date } = userData

  return new Promise(resolve => {
    if (!importantMessage) {
      _data.read('', 'booking', (err, bookingData) => {
        if (!err && bookingData) {
          const user = bookingData.find(el => el.date === date && el.user_id === id)
          let AM = false
          let PM = false
          let message = false

          if (user) {
            AM = !user.time.filter(el => el !== 'AM')[0]
            PM = !user.time.filter(el => el !== 'PM')[0]
          }

          message = AM ? '*you have AM time already booked* (please select only PM half of day)' : defMessage
          if (PM && !message) {
            message = '*you have PM time already booked* (please select only PM half of day)'
          }

          resolve(message)
        } else {
          // ! err file open
        }
      })
    } else {
      resolve(defMessage)
    }
  })
}

options.genNotifMessage = data => {
  const { id, date, time, parkingPlace } = data
  const prettyDate = helper.formatDate(date)

  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        let message = false
        const placeName = config.parkingPlaces[parkingPlace.split('-')[1]]

        if (time[0] === 'AM') {
          message = `<@${id}> booked ${placeName} place on ${prettyDate} at AM`
        } else if (time[0] === 'PM') {
          message = `<@${id}> booked ${placeName} place on ${prettyDate} at PM`
        } else {
          message = `<@${id}> booked ${placeName} place on ${prettyDate} whole day`
        }

        resolve(message)
      } else {
        // ! err file open
      }
    })
  })
}

options.genTimeSelect = userData => {
  const { id, date } = userData

  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        const user = bookingData.find(el => el.date === date && el.user_id === id)
        const elementsCheckboxes = []
        let AM
        let PM

        if (user) {
          AM = !user.time.filter(el => el !== 'AM')[0]
          PM = !user.time.filter(el => el !== 'PM')[0]
        } else {
          AM = false
          PM = false
        }

        if (!AM) {
          elementsCheckboxes.push({
            text: {
              type: 'plain_text',
              text: 'AM',
              emoji: true
            },
            value: 'AM'
          })
        }

        if (!PM) {
          elementsCheckboxes.push({
            text: {
              type: 'plain_text',
              text: 'PM',
              emoji: true
            },
            value: 'PM'
          })
        }

        resolve(elementsCheckboxes)
      } else {
        // ! err file open
      }
    })
  })
}

options.datepicker = (
  message = 'by <https://git.io/jakub|@jsupa>',
  image = 'https://code-planet.eu/images/question.png'
) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: ':parking: Booking',
          emoji: true
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: image,
            alt_text: 'image'
          },
          {
            type: 'mrkdwn',
            text: message
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'datepicker',
            initial_date: helper.yesterday(),
            placeholder: {
              type: 'plain_text',
              text: 'Select a date',
              emoji: true
            },
            action_id: 'book_date'
          }
        ]
      }
    ]
  })
})

options.booking = async (
  date,
  userData,
  message = 'by <https://git.io/jakub|@jsupa>',
  importantMessage = false,
  image = 'https://code-planet.eu/images/question.png'
) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `:date: Booking ${date}`,
          emoji: true
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: image,
            alt_text: 'image'
          },
          {
            type: 'mrkdwn',
            text: await options.genMessage(userData, message, importantMessage)
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'checkboxes',
            options: await options.genTimeSelect(userData),
            action_id: 'select_time'
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'radio_buttons',
            options: await options.genParkingPlace(userData),
            action_id: 'parking_place'
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reset (pick a date)',
              emoji: true
            },
            value: 'click_me_123',
            action_id: 'reset_date'
          }
        ]
      }
    ]
  })
})

options.bookedNotif = async data => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: await options.genNotifMessage(data)
  })
})

options.onlyShowParkingPlace = async (data, date) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `:date: View booked places at ${date}`,
          emoji: true
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'image',
            image_url: 'https://code-planet.eu/images/question.png',
            alt_text: 'image'
          },
          {
            type: 'mrkdwn',
            text: 'by <https://git.io/jakub|@jsupa>'
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '📖 (NOT CLICKABLE)'
        },
        accessory: {
          type: 'radio_buttons',
          options: await options.genParkingPlace(data)
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Reset (pick a date)',
              emoji: true
            },
            value: 'click_me_123',
            action_id: 'reset_date'
          }
        ]
      }
    ]
  })
})

module.exports = options
