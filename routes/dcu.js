//import Express to handle HTTP requests
import express from 'express'

//import functions from database.js to handle SQL queries
import {getDCUChecking3042, getDCUSavings7881} from '../database.js'

const dcuRouter = express.Router()

//DCU GET requests
dcuRouter.get("/DCU-Checking", async (req, res) => {
    const data = await getDCUChecking3042()
    const keys = Object.keys(data[0])
    res.render("account-table", {title: keys, userData: data})
})

dcuRouter.get("/DCU-Savings", async (req, res) => {
    const data = await getDCUSavings7881()
    const keys = Object.keys(data[0])
    res.render("account-table", {title: keys, userData: data})
})

export default dcuRouter