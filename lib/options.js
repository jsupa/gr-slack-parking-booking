const helper = require('./helpers')

const options = {}

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

options.booking = (
  date,
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
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: 'AM',
                  emoji: true
                },
                value: 'value-0'
              },
              {
                text: {
                  type: 'plain_text',
                  text: 'PM',
                  emoji: true
                },
                value: 'value-1'
              }
            ],
            action_id: 'actionId-0'
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
            options: [
              {
                text: {
                  type: 'plain_text',
                  text: ':parking: :one:',
                  emoji: true
                },
                value: 'value-0'
              },
              {
                text: {
                  type: 'plain_text',
                  text: ':parking: :two:',
                  emoji: true
                },
                value: 'value-1'
              },
              {
                text: {
                  type: 'plain_text',
                  text: ':parking: :three:',
                  emoji: true
                },
                value: 'value-2'
              }
            ],
            action_id: 'actionId-0'
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
            action_id: 'actionId-0'
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
