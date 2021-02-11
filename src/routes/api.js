
import fs from 'fs'
import path from 'path'
import moment from 'moment'

module.exports = app => {

  app.post('/search', (req, res) => {

    const file = path.join(__dirname, '../data/daily_14.json')
    const content = JSON.parse(fs.readFileSync(file, 'utf8'))

    console.log(content)
    return res.status(200).send(1234)

  })

  app.get('/admin', (req, res) => {

    return res.status(200).json({
      success: false,
      admin: true
    })

  })

}