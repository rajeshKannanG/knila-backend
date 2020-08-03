'use-strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
    userName: {
        type: String,
        required: true
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location'
    },
    userType: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
})

export class UserClass { }

schema.loadClass(UserClass)

export const user = mongoose.model('user', schema)