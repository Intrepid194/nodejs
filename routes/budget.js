//import Express to handle HTTP requests
import express from 'express'


const budgetRouter = express.Router()

//Budget GET requests
budgetRouter.get('/budget-tracker', async (req, res) => {
    res.render("budget")
})

export default budgetRouter