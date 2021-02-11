
import Server from './server'

const server = new Server()
server.init()

process.on('unhandledRejection', reason => {
  console.log('Unhandled Rejection at:', reason.stack || reason)
})