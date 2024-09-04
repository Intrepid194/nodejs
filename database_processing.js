import mysql from 'mysql2'

import dotenv from 'dotenv'

import pool from './database.js'

import fs from 'fs'

dotenv.config()

//import csvtojson to parse csv files to json
import csvtojson from 'csvtojson'

/*
async function showTables() {
    const [results] = await pool.query('SHOW TABLES')
    return results
}
async function showTableColumns() {
    const [results] = await pool.query()
    return results
}

showTables().then(function(result) {
    result.forEach( (data) => {console.log(data)})
})
*/
/*
async function getBHCheckingAmt() {
    const [results] = await pool.query('SELECT AMOUNT FROM bhchecking9545')
    const keys = Object.keys(results[0])
    return results
}

getBHCheckingAmt().then(function (result) {
    console.log(result[keys])
})*/


function csvtoJSON(filename) {
    //read csv file and split by line
    const csv = fs.readFileSync(`./temp/${filename}`).toString().split("\n")

    //count # of delimiters in headers row
    var delimCt = csv[0].split(",").length - 1

    //parse csv line by line to convert to JS object
    for(let i = csv.length - 1; i>=0; --i) {

        //check if the csv line has less delimiters than the headers row
        if((csv[i].split(",").length - 1) < delimCt) {

            //remove the line if it has less delimiters than the headers row
            csv.splice(i, 1)
        } 
        else {

            //keep csv line as is if it doesn't contain double quotes
            if(csv[i].includes('"') === false) {
                csv[i] = csv[i]
            } 
            //
            else {
                var indices = []
                //flag var for tracking each double quote
                var flag = true

                //loop through each csv line that contains a double quotes
                for(let j = 0; j<csv[i].length; j++) {
                    if (csv[i][j] === '"' && flag === true) {
                        indices.push('|"')
                        flag = false
                    }
                    else if (csv[i][j] === '"' && flag === false) {
                        indices.push('"|')
                        flag = true
                    }
                    else {indices.push(csv[i][j])}
                }
                csv[i] = indices.join('')
                csv[i] = csv[i].split('|')
                for(let j=0; j<csv[i].length; j++) {
                    if(csv[i][j].includes('"') === true) {
                        csv[i][j]= csv[i][j].replace(/\,/g, '|')
                    } 
                    else { csv[i][j] = csv[i][j] }            
                }
                csv[i] = csv[i].join('')
            }
            csv[i] = csv[i].replace(/(\r\n|\n|\r|\t)/gm, "")
        }
        
    }
    for (let i=0; i<csv.length; i++) {
        if(csv[i].includes('"') === false) {
            csv[i] = csv[i].split(',')
        }
        else {
            csv[i] = csv[i].split(',')
            for(let j=0; j<csv[i].length; j++) {
                if(csv[i][j].includes('|') === true) {
                    csv[i][j]= csv[i][j].replace(/\|/g, ',')
                } 
                else { csv[i][j] = csv[i][j] }                  
            }
        }
    }
    for(let i = 0; i<csv.length; i++) {
        for(let j = 0; j<csv[i].length; j++) {
            if (csv[i][j].includes('"')) {
                csv[i][j] = csv[i][j].replace(/"/g, '')
            } else {
                csv[i][j] = csv[i][j]
            }
        }
    }

    //get csv file headers
    var keys = csv[0]

    //get csv file values 
    csv.shift()

    //return headers as keys and values for JS object
    //return {keys: keys, values: csv}
    var res = []
    for (let i = 0; i<csv.length; i++) {
        if (keys.length != csv[i].length || keys.length == 0 || csv[i].length == 0) {
            return null
        }
        var obj = {}
        keys.forEach( (k, j) => { obj[k] = csv[i][j]})
        res.push(obj)
    }

    return res
}

function createObject(keys, values) {
    if (keys.length != values.length || keys.length == 0 || values.length == 0) {
        return null
    }
    var obj = {}
    keys.forEach( (k, i) => { obj[k] = values[i]})
    return obj
}

function jsonRes(keys, values) {
    var res = []
    for(let i = 0; i<values.length; i++) {
        res.push(createObject(keys, values[i]))
    }
    return res
}

//const file = "test.csv"

//const csv = csvtoJSON(file)

//console.log(csv)

//const keys = csv.keys
//const values = csv.values

//const json = jsonRes(keys, values)

//console.log(json[0]['Card #'])
//console.log(parseCSV("1723594160776-export_20240707105448.csv").values)
//var values = parseCSV("1723594077015-Discover-AllAvailable-20240707.csv").values
//var keys = parseCSV("1723594077015-Discover-AllAvailable-20240707.csv").keys
/*csvtojson().fromFile("./temp/1723594160776-export_20240707105448.csv").then( (entry) => [
    console.log(entry)
])*/

//console.log(jsonRes(keys, values))


/*
function parseCSV(filename) {
    const csv = fs.readFileSync(`./temp/${filename}`).toString().split("\n")
    var csv = csv
    //code below reads csv line by line and then splits by commas outside of double quotes
    for(let i = 0; i<csv.length; i++) {
        if(csv[i].includes('"') === true) {
            var indices = []
            var flag = true
            for(let j = 0; j<csv[i].length; j++) {
                if(csv[i][j] === '"' && flag === true) {
                    indices.push('|"')
                    flag = false
                } 
                else if (csv[i][j] === '"' && flag === false) {
                    indices.push('"|')
                    flag = true
                }
                else {indices.push(csv[i][j])}
            }
            csv[i] = indices.join('')
            csv[i] = csv[i].split('|')
            for(let j=0; j<csv[i].length; j++) {
                if(csv[i][j].includes('"') === true) {
                    csv[i][j]= csv[i][j].replace(/\,/g, '|')
                } 
                else { csv[i][j] = csv[i][j] }            
            }
            csv[i] = csv[i].join('')
        } else { csv[i]= csv[i] }
        //replace all csv file type line breaks
        csv[i] = csv[i].replace(/(\r\n|\n|\r|\t)/gm, "")
    }
    
    for (let i=0; i<csv.length; i++) {
        if(csv[i].includes('"') === false) {
            csv[i] = csv[i].split(',')
        }
        else {
            csv[i] = csv[i].split(',')
            for(let j=0; j<csv[i].length; j++) {
                if(csv[i][j].includes('|') === true) {
                    csv[i][j]= csv[i][j].replace(/\|/g, ',')
                } 
                else { csv[i][j] = csv[i][j] }                  
            }
        }
    }
    for(let i = 0; i<csv.length; i++) {
        for(let j = 0; j<csv[i].length; j++) {
            if (csv[i][j].includes('"')) {
                csv[i][j] = csv[i][j].replace(/"/g, '')
            } else {
                csv[i][j] = csv[i][j]
            }
        }
    }
    var keys = csv[0]
    csv.shift()
    return {keys: keys, values: csv}
}
*/