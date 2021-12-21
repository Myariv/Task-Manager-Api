const express = require('express')
const app = express()

// To make sure the db conection still runing we require it hrere
require('./db/mongoose')

const userRouters = require('./routers/user')
const taskRouters = require('./routers/task')

// set the express to parse the incom json objects! 
app.use(express.json())

// set the router to navigate throw the routes
app.use(userRouters)
app.use(taskRouters)


module.exports = app



