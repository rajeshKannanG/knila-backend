'use-strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    appointmentDate: {
        type: Date
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'location'
    },
    status: {
        type: String,
        default: 'Requested'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

export class AppointmentClass { }

schema.loadClass(AppointmentClass)

export const appointment = mongoose.model('appointment', schema)