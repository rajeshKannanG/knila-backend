'use-strict'
import winston from 'winston'

const tsFormat = () => ( new Date() ).toLocaleTimeString()
export const logger = (msg) => {
    new winston.Logger({
        transports: 
        new winston.transports.Console({
            timestamp: tsFormat,
            colorsize: true
        })
    }).error(msg)
}