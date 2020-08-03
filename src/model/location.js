'use-strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
    locationName: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
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

export class LocationClass { }

schema.loadClass(LocationClass)

export const location = mongoose.model('location', schema)