import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise()

//Bank Hometown SQL queries
export async function getBHChecking9545() {
    const [rows] = await pool.query("SELECT Date, Description, Amount, Balance FROM bhchecking9545")
    return rows
}


export async function getBHSavings9553() {
    const [rows] = await pool.query("SELECT Date, Description, Amount, Balance FROM bhsavings9553")
    return rows
}

//DCU SQL queries
export async function getDCUChecking3042() {
    const [rows] = await pool.query("SELECT Date, Description, Amount, `Current Balance` FROM dcuchecking3042")
    return rows
}

export async function getDCUSavings7881() {
    const [rows] = await pool.query("SELECT Date, Description, Amount, `Current Balance` FROM dcusavings7881")
    return rows
}

//Discover SQL queries
export async function getDiscoverCredit4142() {
    const [rows] = await pool.query("SELECT `Trans. Date`, Description, Amount, Category FROM discovercredit4142")
    return rows
}

//upload csv file to MySQL table line by line
export async function uploadToMySQL (file, tablename) {
    
    if (typeof file != 'object') {

        return null

    } else {
        for (let i = 0; i<file.length; i++) {

            var items = []

            for(const value in file[i]) {

                items.push(file[i][value])

            }
    
            var questionArr = ''
            for(let i = 0; i<items.length-1; i++) {
                questionArr = questionArr + '?, '
            }
            questionArr = questionArr + '?'
            
            //get name of mySQL table
            const table_name = tablename.slice(0, -4).replace(/\.|_|-/g,"")
    
            //mySQL insert row into table
            var insertStatement = `INSERT INTO` + '`' + table_name + '`' + `values(${questionArr})`

            insertStatement = mysql.format(insertStatement, items)

            await pool.execute(insertStatement)
            
        }
        return console.log("Uploaded Successfully!")
    }
}

//check if table exists in mysql server
export async function checkTable(file) {

    //check if filename input is of type string
    if (typeof file === 'string') {

        const tableName = file.slice(0, -4).replace(/\.|_|-/g,"")

        //mySQL query for checking if table exists
        var checkingTable = "SELECT EXISTS (SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = ?)"

        const database = process.env.MYSQL_DB

        const table = tableName

        var items = [database, table]

        checkingTable = mysql.format(checkingTable, items)

        var [results] = await pool.execute(checkingTable)

        return Object.values(results[0])[0]

    } else {
        //return null if not of type string
        return null

    } 
}

//create mySQL table from csv file
export async function createTable(file, fileJSON) {

    if (typeof file === 'string' && typeof fileJSON === 'object') {
    
        //name table from csv file name
        const tableName = file.slice(0, -4).replace(/\.|_|-/g,"")

            //mySQL create table
            var createTable =`CREATE TABLE ??(`

            //payload for mySQL create table statement
            var items = Object.keys(fileJSON[0])

            items.unshift(tableName)

            for (const prop in fileJSON[0]) {
                createTable = createTable + '?? VARCHAR(1000), '
            }

            createTable = createTable.slice(0, -2) + ")"

            createTable = mysql.format(createTable, items)

            const [result, fields] = await pool.execute(createTable)

    } else {

        return null

    }  
}

export default pool