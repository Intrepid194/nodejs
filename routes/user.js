//import Express to handle HTTP requests
import express from 'express'

const userRouter = express.Router()

import { compareCredentials} from '../middleware/user_authentication.js'

//Home page GET requests
userRouter.get('/', async (req, res) => {
    res.render('home', { name: 'Spencer'})
})

userRouter.get('/login', async (req, res) => {
    res.render('login', { name: 'Spencer'})
})

userRouter.get('/accounts-home', async (req, res) => {
    res.render('accounts-summary', { name: 'Name'})
})

//Home page POST Requests
userRouter.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    const isValid = compareCredentials(username, password).then( (results) => { 
        if(results.isMatchUsername === true && results.isMatchPassword === true) {
            res.redirect('/accounts-home')
        } else {
            console.log("try again")
        }
    })
    //console.log(isValid)
})

export default userRouter