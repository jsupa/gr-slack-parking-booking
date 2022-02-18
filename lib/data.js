const fs = require('fs')
const path = require('path')
const helpers = require('./helpers')

const _data = {}

_data.baseDir = path.join(__dirname, './../data/')

_data.read = async (dir, file, callback) => {
  await fs.readFile(`${_data.baseDir + dir}/${file}.json`, 'utf-8', (err, data) => {
    if (!err && data) {
      const parsedData = JSON.parse(data)
      callback(false, parsedData)
    } else {
      callback(err, data)
    }
  })
}

_data.update = (dir, file, data, callback) => {
  fs.open(`${_data.baseDir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data)
      fs.ftruncate(fileDescriptor, err => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, err => {
            if (!err) {
              fs.close(fileDescriptor, err => {
                if (!err) {
                  callback(false)
                } else {
                  callback('Error closing existing file')
                }
              })
            } else {
              callback('Error writing to existing file')
            }
          })
        } else {
          callback('Error truncating file')
        }
      })
    } else {
      callback('Could not open the file for updating, it may not exist yet')
    }
  })
}

module.exports = _data
