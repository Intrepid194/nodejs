//import Express to handle HTTP requests
import express from 'express'

//import functions from database.js to handle SQL queries
import {getBHChecking9545, getBHSavings9553} from '../database.js'

const bhRouter = express.Router()

//Bank Hometown GET requests
bhRouter.get("/BH-Checking", async (req, res) => {
    const data = await getBHChecking9545()
    const keys = Object.keys(data[0])
    res.render("account-table", {title: keys, userData: data})
})

bhRouter.get("/BH-Savings", async (req, res) => {
    const data = await getBHSavings9553()
    const keys = Object.keys(data[0])
    res.render("account-table", {title: keys, userData: data})
})

export default bhRouter