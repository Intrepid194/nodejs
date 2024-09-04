

import mysql from 'mysql2'

import bcrypt from 'bcryptjs'

import dotenv from 'dotenv'

dotenv.config()

//const hashedPassword = await bcrypt.hash(password, 17)

//create connection to users database
const con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.USER_DB
}).promise()

//hash username and password when changing them
export async function hashCredentials(username, password) {

    //salt rounds
    const salt = 17

    //hash username
    const hashedUsername = await bcrypt.hash(username, salt)

    //hash password
    const hashedPassword = await bcrypt.hash(password, salt)
    
    return [hashedUsername, hashedPassword]
}

//compare the inputted username and password with the stored credentials
export async function compareCredentials(username, password) {

    //get stored credentials from db
    const hashedCredentials = await con.execute("SELECT * FROM users LIMIT 1")

    //sotred username and password
    const hashedUsername = hashedCredentials[0][0].username
    const hashedPassword = hashedCredentials[0][0].password
    
    //compare username against hashed username in db
    const isMatchUsername = await bcrypt.compare(username, hashedUsername)

    //compare password against hashed password in db
    const isMatchPassword = await bcrypt.compare(password, hashedPassword)

    return  {isMatchUsername, isMatchPassword}

}

//compareCredentials("hi", "there").then( (results) => console.log(results))

/*
hashCredentials('Helicopter!2381','x1gDocK_1,6').then( async (results) => {
    var insertStatement = "INSERT INTO users (username, password) VALUES(?, ?)"
    insertStatement = mysql.format(insertStatement, results)
    console.log(insertStatement)

    await con.execute(insertStatement)

    console.log("insert successful")
})
*/
//console.log(creds)

//var insertStatement = "INSERT INTO users (username, password) VALUES(?, ?)"




//await con.execute()



//console.log(hashedPassword)

