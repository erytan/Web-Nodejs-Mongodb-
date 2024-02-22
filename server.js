const express = require('express'); //commonjs
const path = require('path'); //
require('dotenv').config();
const dbConnection = require('./config/dbconnect');
const initRoutes = require('./routes')

const app = express(); // app express
const port = process.env.PORT || 3000; //port
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnection()
initRoutes(app)

// const hostname = process.env.HOST_NAME; //host
// //config template engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// //khai bao routers
// app.use('/', (req, res) => {
//         res.send("e, world!")
//     })
// app.get('/abc', (req, res) => {
//     res.render('src/views/test.ejs')
// })
app.listen(port, () => {
    console.log(`Express listening on port ${port}`)
})