
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { isEmpty, getIndexes, reverseDate } from '../helper'

let weatherData = []
const weatherFile = path.join(__dirname, '../data/weather.json')

if (fs.existsSync(weatherFile)) {
  weatherData = JSON.parse(fs.readFileSync(weatherFile, 'utf8'))
}

const admin = async (req, res) => {
  try {

    let show = !req.url.includes('remove')

    if (isEmpty(req.body) && isEmpty(req.body.city_name)) {
      return res.status(400).json({ message: 'Please enter city name.' })
    }

    const indexes = getIndexes(weatherData, 'city_name', req.body.city_name)
    const indexes_length = indexes.length

    if (indexes_length > 0) {

      for (let i = 0; i < indexes_length; i++) {
        weatherData[indexes[i]].show = show
      }

    } else {
      return res.status(400).json({ message: `The city (${req.body.city_name}) is not exist!` })
    }


    fs.writeFileSync(weatherFile, JSON.stringify(weatherData))

    return res.status(200).json({
      message: `The city (${req.body.city_name}) has been ${show ? 'added': 'removed'} successfully!`
    })

  } catch (e) {
    console.log('ERROR:', e.message)
    return res.status(500).end()
  }
}

module.exports = app => {

  // Search city by name and date
  app.post('/search', async (req, res) => {
    try {

      // Checking for weather data.
      if (weatherData.length === 0) return res.status(500).end()

      // Checking if city and date format is correct.
      if (isEmpty(req.body.city_name)) {
        return res.status(400).json({ message: 'Please enter city name.' })
      } else if (!req.body.date.match(/^((\d{1,2})-\d{1,2})\-(\d{4})$/)) { // DD-MM-YYYY
        return res.status(400).json({ message: 'Please make sure the date format is correct, like DD-MM-YYYY.' })
      }

      // Filters
      const data = weatherData.filter(c =>
        c.show &&
        c.city_name.toLowerCase() === req.body.city_name.toLowerCase() &&
        moment(c.date).isSame(reverseDate(req.body.date), 'day')
      )

      return res.status(200).json(data.length > 0 ? data : { message: 'Your weather data was not found.' })

    } catch (e) {
      console.log('ERROR:', e.message)
      return res.status(500).end()
    }
  })

  // Insert city to search
  app.post('/admin', admin)

  // Remove city from search
  app.post('/admin/remove', admin)

  // Delete city from file
  app.delete('/admin', async (req, res) => {
    try {

      if (isEmpty(req.body) && isEmpty(req.body.city_name)) {
        return res.status(400).json({ message: 'Please enter city name.' })
      }

      const weather_length = weatherData.length

      weatherData = weatherData.filter(c => c.city_name.toLowerCase() !== req.body.city_name.toLowerCase())

      if (weatherData.length === weather_length) {
        return res.status(400).json({ message: `The city (${req.body.city_name}) is not exist!` })
      }

      fs.writeFileSync(weatherFile, JSON.stringify(weatherData))

      return res.status(200).json({
        message: `The city (${req.body.city_name}) has been deleted successfully!`
      })

    } catch (e) {
      console.log('ERROR:', e.message)
      return res.status(500).end()
    }
  })

}

// The city (<NAME>) has been added successfully!
// The city (<NAME>) has been removed successfully!
// The city (<NAME>) has been deleted successfully!
