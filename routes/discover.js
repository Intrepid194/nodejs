//import Express to handle HTTP requests
import express from 'express'

//import functions from database.js to handle SQL queries
import {getDiscoverCredit4142} from '../database.js'

const discoverRouter = express.Router()

discoverRouter.get("/Discover-Credit", async (req, res) => {
    const data = await getDiscoverCredit4142()
    const keys = Object.keys(data[0])
    res.render("account-table", {title: keys, userData: data})
})

export default discoverRouter