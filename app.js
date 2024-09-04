//app.js

//import Express to handle HTTP requests
import express from 'express'

//import https to create HTTPS server
import https from 'https'

//import bankHometown HTTP request routes
import bhRouter from './routes/bankhometown.js'

//import DCU HTTP request routes
import dcuRouter from './routes/dcu.js'

//import Discover HTTP request routes
import discoverRouter from './routes/discover.js'

//import User HTTP request routes
import userRouter from './routes/user.js'

//import File Uploads HTTP request routes
import uploadRouter from './routes/uploadfiles.js'

//import Budget Tracker HTTP request routes
import budgetRouter from './routes/budget.js'

import path from 'path'
import {fileURLToPath} from 'url'

//import file system to handle SSL certificate from local files
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.urlencoded({extended: false}))

//cofigure middleware functions for app.js to use
//User Routes
app.use('/', userRouter) 

//Bank Hometown Routes
app.use('/bankHometown', bhRouter)

//DCU Routes
app.use('/DCU', dcuRouter)

//Discover Routes
app.use('/Discover', discoverRouter)

//Upload Files Routes
app.use(uploadRouter)

//Budget Tracker Routes
app.use(budgetRouter)

//parse json payloads from client
app.use(express.json())

//define port for server to listen on
const port = process.env.PORT

//set template engine to ejs
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Set public path
const publicPath = path.join(__dirname, 'public')

app.use(express.static(publicPath))

//call error stack
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

//create JS object for SSL certificate and key
const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
}

//set up HTTPS server to listen on port 3000
//and pssing options and app object to it
/*https.createServer(options, app)
    .listen(port, (req, res) => {
        console.log("App connected")
    })

*/

app.listen(port, () => {
    console.log("Server running on port")})