
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

export {
  isUndefinedOrNull,
  isEmpty,
  getIndexes,
  reverseDate
}
