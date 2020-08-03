'use-strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import moment from 'moment'
import { user } from 'model/user'
import { role } from 'model/role'
import { appointment } from 'model/appointment'
import { location } from 'model/location'
import { accessToken, verifyToken } from 'utils/accessToken'
const app = express(feathers())

const response = (status, data, res) => {
    res.status(status)
    res.send(JSON.stringify(data))
}


app.post('/signIn', async (req, res) => {
    try {
       // console.log("isnsideee", req.body.password)
        const email = req.body.email || ''
        const password = req.body.password || ''
        if (!email || !password) {
            return response(200, { success: false, msg: 'required param is missing' }, res)
        }
        let findData = await user.findOne({ email, password })
        if (!findData) {
            return response(200, { success: false, msg: 'Incorrect username or passord' }, res)
        }
        const token = await accessToken(findData._id)
        return response(200, { success: true, msg: 'login successfully', token, role: findData.userType }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

app.post('/signUp', async (req, res) => {
    try {
        const email = req.body.email || ''
        const userName = req.body.userName || ''
        const password = req.body.password || ''
        const roleId = req.body.roleId || ''
        const city = req.body.location || ''
        if (!email || !userName || !password || !roleId) {
            return response(200, { success: false, msg: 'Required param is missing' }, res)
        }
        const findData = await user.findOne({ email })
        if (findData) {
            return response(200, { success: false, msg: 'User Already Exists' }, res)
        }
        let roleOf = await role.findOne({ _id: roleId })
        if (!roleOf) {
            return response(200, { success: false, msg: 'Role Not Found' }, res)
        }
        let locationData = { locationName: city, latitude: "11.004556", longitude: "76.961632" }
        //console.log(locationData)
        const insertId = await location.create(locationData)
        const data = { userName, email, locationId: insertId._id, password, roleId, userType: roleOf.role }
        await user.create(data)
        return response(200, { success: true, msg: 'user created successfully' }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})


app.post('/list', verifyToken, async (req, res) => {
    try {
        const userData = req.userData || ''
        const limit = req.body.limit || 10
        const page = req.body.page || 1
        const skip = limit * (page - 1)
        const email = req.body.email || ''
        let startDate = req.body.startDate || ''
        let endDate = req.body.endDate || ''
        let status = req.body.status || 0
        //console.log(userData.userType, userData.userType.toLowerCase())
        userData.userType = userData.userType.toLowerCase()
        let filterData = (userData.userType == 'doctor') ?
            { doctorId: userData._id, status: 'Requested' } :
            { createdBy: userData._id }

        if (email != '') {
            filterData.email = email
        }

        if (startDate != '' && endDate != '') {
            startDate = moment(startDate).startOf('day')
            endDate = moment(endDate).endOf('day')
            filterData.createdAt = { $gte: startDate, $lte: endDate }
        }

        if (status != 0) {
            filterData.status = status
        }
        //console.log(filterData, 'foillll')
        let populated = (userData.userType == 'doctor') ? 'createdBy' : 'doctorId'
        let listData = await appointment.find(filterData).populate(populated).sort({ _id: -1 }).skip(skip).limit(limit)
        //console.log(listData, 'litsss')
        let totalRecord = await appointment.count(filterData)
        let data = {
            totalRecord,
            limit,
            page,
            list: []
        }
        if (totalRecord) {
            let listArray = []
            for (let index = 0; index < listData.length; index++) {
                let element = listData[index]
                let temp = {}
                temp.appointmentId = element._id
                temp.email = (userData.userType == 'doctor') ? element.createdBy.email : element.doctorId.email
                temp.name = (userData.userType == 'doctor') ? element.createdBy.userName : element.doctorId.userName
                temp.type = (userData.userType == 'doctor') ? element.createdBy.userType : element.doctorId.userType
                temp.appointmentDate = moment(element.appointmentDate).format('L')
                temp.action = element.status
                listArray.push(temp)
            }
            data.list = listArray
        }
        return response(200, { success: true, data }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})


app.post('/appointment-update', verifyToken, async (req, res) => {
    try {
        const userData = req.userData
        const status = req.body.status || ''
        const appointmentId = req.body.appointmentId || ''
        //console.log(appointmentId, status)
        if (appointmentId == '' || status == '') {
            return response(200, { success: false, msg: 'required param missing' }, res)
        }

        if (status !== 'Rejected' && status !== 'Fixed') {
            return response(200, { success: false, msg: 'Invalid status' }, res)
        }
        const data = await appointment.findOneAndUpdate({ _id: appointmentId }, { status })
        return response(200, { success: true, msg: 'sucessfully updated' }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

app.post('/drop-down/doctor', verifyToken, async (req, res) => {
    try {
        const userData = req.userData
        const data = await user.find({
            $or: [
                { userType: 'doctor' },
                { userType: 'Doctor' }
            ]
        }, { userName: 1 }).populate('locationId', ['locationName'])
        const resultList = []
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let tmp = {}
            tmp.userId = element._id
            tmp.userName = element.userName
            tmp.locationId = element.locationId._id
            tmp.locationName = element.locationId.locationName
            resultList.push(tmp)
        }
        return response(200, { success: true, data: resultList }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

app.get('/drop-down/location', verifyToken, async (req, res) => {
    try {
        const userData = req.userData
        const data = await location.find({}, { locationName: 1 })
        return response(200, { success: true, data }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

app.get('/drop-down/role', async (req, res) => {
    try {
        const data = await role.find({})
        return response(200, { success: true, data }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

app.post('/appointment', verifyToken, async (req, res) => {
    try {
        const doctorId = req.body.doctorId || ''
        const locationId = req.body.locationId || ''
        const appointmentDate = req.body.appointmentDate || ''

        const userData = req.userData
        if (!doctorId || !appointmentDate || !locationId) {
            return response(200, { success: false, msg: 'Required param is missing' }, res)
        }
        const finding = await appointment.findOne({ doctorId, appointmentDate: appointmentDate, createdBy: userData._id })
        if (finding) {
            return response(200, { success: false, msg: 'Already Requested' }, res)
        }
        const data = { doctorId, appointmentDate, locationId, createdBy: userData._id }
        await appointment.create(data)
        return response(200, { success: true, msg: 'Appointment created successfully' }, res)
    } catch (error) {
        console.log("Errror: ", error)
        return response(200, { success: false, msg: 'Internal server error' }, res)
    }
})

export default app