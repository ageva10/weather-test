
const getIndexes = (a, b, c) => {
  let indexes = []
  a.findIndex((e, i) => {
    if (e[b] && e[b].toString() === c.toString()) {
      indexes.push(i)
    }
  })
  return indexes
}

const getNewId = (a, b) => {
  return a[a.length + b] ? getNewId(a, ++b) : a.length + b
}

// This is random weather data!
const getWeatherData = () => {
  return {
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
}

const isValidCityAndDate = (req, res) => {
  if (!req.body.city) {
    return res.status(400).json({ message: 'Please enter the city name.' })
  } else if (!req.body.date.match(/^((\d{4})-\d{1,2})\-(\d{1,2})$/)) { // YYYY-MM-DD
    return res.status(400).json({ message: 'Please make sure the date format is correct, like YYYY-MM-DD.' })
  }
}

export {
  getIndexes,
  getNewId,
  getWeatherData,
  isValidCityAndDate
}
