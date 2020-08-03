'use-strict'

import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
    role: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    }
})

export class RoleClass { }

schema.loadClass(RoleClass)

export const role = mongoose.model('role', schema)