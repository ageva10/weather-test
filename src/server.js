
import fs from 'fs'
import path from 'path'
import http from 'http'
import moment from 'moment'
import express from 'express'
import bodyParser from 'body-parser'

import config from './config'
import api from './routes/api'

export default class Server {

  constructor() {
    this.app = express()
    this.app.use(bodyParser.json({ limit: '10mb' }))
    this.app.use(bodyParser.urlencoded({ extended: false }))
  }

  init() {
    console.log('Initializing ...')
    this.createServer()
    this.createRouter()
  }

  createServer() {
    try {
      this.server = http.createServer(this.app)
      this.server.listen(config.PORT, () => {
        console.log('Server is started at port ' + config.PORT)
        process.once('SIGINT', this.closeServer).once('SIGTERM', this.closeServer)
      })
    } catch (e) {
      console.log('ERROR:', e.message)
    }
  }

  createRouter() {
    try {
      const apiRouter = express.Router()
      api(apiRouter)
      this.app.use('/', apiRouter)
      this.app.use('*', (req, res) => res.status(500).end())
    } catch (e) {
      console.log('ERROR:', e.message)
    }
  }

  closeServer() {
    try {
      this.server.close()
    } catch (e) {
      console.log('ERROR:', e.message)
      process.exit()
    }
  }
}