
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { getIndexes, getNewId, getWeatherData, isValidCityAndDate } from '../helper'

//////////////////////////////////////////
/*
const date = moment().utcOffset(0)
date.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
console.log(date.toISOString())
console.log(date.format())

// 7 Days ago
const weather = path.join(__dirname, '../data/weather.json')

const file = path.join(__dirname, '../data/city.list.json')
const content = JSON.parse(fs.readFileSync(file, 'utf8'))
const array = []

for (let i = 0; i < Math.ceil(content.length / 7); i++) {
  const isShow = Boolean(Math.floor(Math.random() * 2))
  for (let y = 1; y <= 7; y++) {

    const data = {
      id: content[i].id,
      city_name: content[i].name,
      date: moment(date, 'DD-MM-YYYY').add(-y, 'd'),
      show: isShow,
      weather: {
        temp: Number((Math.random() * (30 - 20 + 1) + 20).toFixed(2)),
        temp_min: Number((Math.random() * (20 - 10 + 1) + 10).toFixed(2)),
        temp_max: Number((Math.random() * (50 - 30 + 1) + 30).toFixed(2)),
        feels_like: Number((Math.random() * (50 - 20 + 1) + 20).toFixed(2)),
        pressure: Number((Math.random() * (1010 - 1000 + 1) + 1000).toFixed(2)),
        humidity: Number((Math.random() * (80 - 70 + 1) + 70).toFixed(2)),
        wind: {
          speed: Number((Math.random() * (15 - 1 + 1) + 1).toFixed(1)),
          deg: Number((Math.random() * (250 - 230 + 1) + 230).toFixed(2)),
        },
        clouds: {
          all: Number((Math.random() * (100 - 90 + 1) + 90).toFixed(1))
        }
      }
    }

    array.push(data)

  }
}

fs.writeFileSync(weather, JSON.stringify(array))

console.log(array)

 */
//////////////////////////////////////////

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
