'use strict'
import 'app-module-path/register'
import logger from 'winston'
import config from '../config'
import app from './app'
import { dbconnection } from 'utils/connection'
dbconnection(config, 0)
const serverUp = (app) => {
   // console.log(config, "config")
    const server = app.listen(config.port)
    server.on( 'listening', () =>
        logger.info( "server is connected ", config.port )
    )
}

serverUp(app)