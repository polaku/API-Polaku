const fs = require('fs')

module.exports = function logError(input) {
  let data = JSON.parse(fs.readFileSync('./log/error.json', 'utf8'))
  let newData = {
    id: data.length === 0 ? 1 : (data[data.length - 1].id) + 1,
    uri: input.uri,
    method: input.method,
    status: input.status,
    message: input.message,
    created_at: new Date()
  }

  if (input.user_id) {
    newData.user_id = input.user_id;
  }

  data.push(newData)

  fs.writeFileSync('./log/error.json', JSON.stringify(data, '', 2))
}