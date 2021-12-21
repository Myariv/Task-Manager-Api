const app = require('./app')

const port = process.env.PORT

// PORT LISTEN ----------------------------------------------------------------
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})



