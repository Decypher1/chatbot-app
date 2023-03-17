require("dotenv").config()

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
    sessionSecret: process.env.sessionSecret,
    sessionMaxAge: process.env.sessionMaxAge,
}