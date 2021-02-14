
const isUndefinedOrNull = (a) => {
  return a === undefined || a === null
}

const isEmpty = (a) => {
  return isUndefinedOrNull(a) || JSON.stringify(a) === '{}' || a.length === 0
}

const getIndexes = (a, b, c) => {
  let indexes = []
  a.findIndex((e, i) => {
    if (e[b] && e[b].toString().toLowerCase() === c.toString().toLowerCase()) {
      indexes.push(i)
    }
  })
  return indexes
}

const reverseDate = (a) => {
  return a.split('-').reverse().join('-')
}

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

export {
  isUndefinedOrNull,
  isEmpty,
  getIndexes,
  reverseDate,
  getWeatherData
}
