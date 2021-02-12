
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { getIndexes, getNewId, getWeatherData, isValidCityAndDate } from '../helper'

let weatherData = null
const weatherFile = path.join(__dirname, '../data/weather.json')

if (fs.existsSync(weatherFile)) {
  weatherData = JSON.parse(fs.readFileSync(weatherFile, 'utf8'))
}

module.exports = app => {

  // Search city by name and date.
  app.post('/search', async (req, res) => {
    try {

      // Checking for weather data.
      if (!weatherData) return res.status(500).end()

      // Checking if city and date format is correct.
      if (!req.body.city) {
        return res.status(400).json({ message: 'Please enter the city name.' })
      } else if (!req.body.date.match(/^((\d{4})-\d{1,2})\-(\d{1,2})$/)) { // YYYY-MM-DD
        return res.status(400).json({ message: 'Please make sure the date format is correct, like YYYY-MM-DD.' })
      }

      // Filters
      const data = weatherData.filter(c =>
        c.show === true &&
        c.city_name.toLowerCase().includes(req.body.city.toLowerCase()) &&
        moment(c.date).isSame(req.body.date, 'day')
      )

      return res.status(200).json(data.length > 0 ? data : { message: 'Your weather data was not found.' })

    } catch (e) {
      console.log('ERROR:', e.message)
      return res.status(500).end()
    }
  })

  // Insert city
  app.post('/admin', async (req, res) => {
    try {

      // Checking if city and date format is correct.
      if (!req.body.city) {
        return res.status(400).json({ message: 'Please enter the city name.' })
      } else if (!req.body.date.match(/^((\d{4})-\d{1,2})\-(\d{1,2})$/)) { // YYYY-MM-DD
        return res.status(400).json({ message: 'Please make sure the date format is correct, like YYYY-MM-DD.' })
      }

      const data = {
        id: getNewId(weatherData, 0),
        city_name: req.body.city,
        date: moment(req.body.date),
        show: true,
        ...getWeatherData()
      }

      fs.writeFileSync(weatherFile, JSON.stringify(weatherData))

      weatherData.push(data)

      return res.status(200).json({
        message: 'The city has been added.'
      })

    } catch (e) {
      console.log('ERROR:', e.message)
      return res.status(500).end()
    }
  })

  // Delete city by id
  app.delete('/admin/:id', async (req, res) => {
    try {

      const id = req.params.id
      if (!id) return res.status(400).json({ message: 'Please enter city id.' })

      const indexes = getIndexes(weatherData, 'id', id)
      if (indexes.length === 0) return res.status(400).json({ message: 'There is no city with this id.' })

      weatherData = weatherData.filter((c, i) => {
        return c.show && indexes.indexOf(i) === -1
      })

      fs.writeFileSync(weatherFile, JSON.stringify(weatherData))

      return res.status(200).json({
        message: 'The city has been deleted.'
      })

    } catch (e) {
      console.log('ERROR:', e.message)
      return res.status(500).end()
    }
  })

}
