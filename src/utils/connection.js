'use-strict'
import mongoose from 'mongoose'
import config from '../../config'

export const dbUri = config.host

export const dbconnection = (config, test=1) => {
    //console.log(config, "configdbb")
    if(mongoose.connection.readyState == 0){
        mongoose.connect(dbUri, {useNewUrlParser: true}).then(client => {
            if(!test){
                console.log("connected successfull noSQL")
            }
        })
    }
}