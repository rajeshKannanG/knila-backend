'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import cors from 'cors'
import socketio from '@feathersjs/socketio'
import logger from 'winston'
import config from '../config'
import services from './services'
const configuration = async (req, res, next) => {
    req.config = config
    next()
}

const app = express(feathers())

app.use(cors())
app.use(configuration)
app.use(express.json())
app.use(express.errorHandler({logger}))
app.use(express.urlencoded({ extended : true}))
app.configure(express.rest())
app.configure(services)
app.configure(socketio())

module.exports = app