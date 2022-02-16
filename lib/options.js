const helper = require('./helpers')
const config = require('./config')
const _data = require('../lib/data')

const options = {}

options.genParkingPlace = () => {
  const elementsRadioButtons = []
  config.parkingPlaces.forEach((place, index) => {
    elementsRadioButtons.push({
      text: {
        type: 'plain_text',
        text: place,
        emoji: true
      },
      value: `parking-${index}`
    })
  })
  return elementsRadioButtons
}

options.genTimeSelect = userData => {
  const { id, date } = userData

  return new Promise(resolve => {
    _data.read('', 'booking', (err, bookingData) => {
      if (!err && bookingData) {
        const user = bookingData.find(el => el.date === date && el.user_id === id)
        let AM
        let PM

        if (user) {
          AM = !user.time.filter(el => el !== 'AM')[0] ? ':octagonal_sign:' : ''
          PM = !user.time.filter(el => el !== 'PM')[0] ? ':octagonal_sign:' : ''
        } else {
          AM = ''
          PM = ''
        }
        const elementsCheckboxes = [
          {
            text: {
              type: 'plain_text',
              text: `AM ${AM}`,
              emoji: true
            },
            value: 'AM'
          },
          {
            text: {
              type: 'plain_text',
              text: `PM ${PM}`,
              emoji: true
            },
            value: 'PM'
          }
        ]
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
            options: options.genParkingPlace(),
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
              text: 'Book',
              emoji: true
            },
            value: 'click_me_123',
            action_id: 'book_button'
          },
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
