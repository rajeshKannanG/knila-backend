import config from '12factor-config'
const cfg = config ({
    host : {
        env: 'DBURL',
        type: 'string',
        default: 'mongodb://127.0.0.1:27017/knila'
    },
    port : {
        env: 'Port',
        type: 'integer',
        default: '3030'
    },
    privateKey : {
        env      : 'PRIVATE_KEY',
        type     : 'string',
        default  : 'cb637f30f881470bdf1ebddeee9b433f771020bc',
    },
})

module.exports = cfg