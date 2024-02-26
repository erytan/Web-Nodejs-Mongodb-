const express = require('express'); //commonjs
const path = require('path'); //
require('dotenv').config();
const dbConnection = require('./config/dbconnect');
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser');


const app = express(); // app express
const port = process.env.PORT || 3000; //port
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnection()
initRoutes(app)


app.listen(port, () => {
    console.log(`Express listening on port ${port}`)
})