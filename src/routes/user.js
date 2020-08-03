'use-strict'
import userService from 'services/userService'

export default (app) => {
    app.use('/user', userService)
}
