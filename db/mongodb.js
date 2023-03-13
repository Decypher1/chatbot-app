const mongoose = require('mongoose')
const CONFIG = require('../config/config')

function dbConnect(){
    mongoose.connect(CONFIG.MONGODB_URL)

    mongoose.connection.on("connected", () => {
        console.log('MongoDB connected successfully')
    })

    mongoose.connection.on("error", (err)=> {
        console.log('Error connecting to database')
        console.log(err)
    })
}

module.exports= dbConnect;