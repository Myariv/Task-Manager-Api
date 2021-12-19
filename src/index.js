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


/* advanced routes!
// app.use('/users', userRouters)
// app.use('/tasks', taskRouters)
*/


// PORT LISTEN ----------------------------------------------------------------
const port = process.env.PORT
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})



