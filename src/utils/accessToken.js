'use strict'
import jwt from 'jsonwebtoken'
import config from  '../../config'
import {user} from  '../model/user'
const optionalData = {
    issuer: "knila.com",
    algorithm: "HS256",
    audience: "knila.com"
}
const privateKey = config.privateKey

export const accessToken = (id) => {
    const token = jwt.sign({ token_id: id }, privateKey, optionalData)
    return token
}

export const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']
    jwt.verify(token, privateKey, optionalData, async (err, decoded) => {
        if(err){
            return res.status(400).send({errMsg: err})
        }else{
            const findData = await user.findOne({_id: decoded.token_id})
            if(!findData){
                return res.status(400).send({errMsg: 'Invalid token'})
            }
            req.userData = findData
            next()
        }
    })
}