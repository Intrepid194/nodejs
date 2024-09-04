//import multer middleware for uploading csv files
import multer from 'multer'

//import csvtojson to parse csv files to json
//import csvtojson from 'csvtojson'

//import file system module to handle uploaded files
import fs from 'fs/promises'

//import path module for file paths
import path from 'path'

import csv from 'csv-parser'

//import fs-extra to move files across folders 
import fse from 'fs-extra'
import { read } from 'fs'

//import functions for uploading from database.js
import {uploadToMySQL, createTable, checkTable} from '../database.js'


//create a storage object for uploading files
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "temp/")
    },
    filename: (req, file, callback) => {
        //callback(null, Date.now() + "-" + file.originalname)
        callback(null, file.originalname)
    }
})

//storage object for uploading to mysql db
const uploadStorage = multer({ 
    storage: storage,
    limits: { fileSize: 5000000}, //50 MB file size limit
    fileFilter: function(req, file, callback) {
        checkFileType(file, callback)
    }
})

//check file type
function checkFileType(file, callback) {
    //only accept csv files
    const filetypes = /csv/ 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return callback(null, true)
    } else {
        console.log('Error: CSV files only! (.csv)')
    }
}

//data processing functions
//read the uploads folder for all csv files
export async function myReadDir() {
    const tempFolder = './temp/'
    const file = await fs.readdir(tempFolder)
    return file
}

//push files to upload folder from temporary folder after processing
export async function tempToUploads (filename) {
    const file = await fse.move(`./temp/${filename}`,`./uploads/${filename}`, {overwrite: true})
}

//read the csv file
export async function readCSVFile(filename) {
    const readFile = await fs.readFile(`./temp/${filename}`, 'utf8')
    return readFile
}


//convert csv file to json for uploading to mysql tables
export function csvtoJSON(filename) {
    //aplit csv file by line
    const csv = filename.toString().split("\n")

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
            csv[i] = csv[i].replace(/(\.|\r\n|\n|\r|\t)/gm, "")
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
    const keys = csv[0]

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

//code to upload all files in directiory to mysql database
export function uploadCSVFilesToMySQL () {
    myReadDir().then( (files) => {
        files.forEach( (filename) => {
            readCSVFile(filename).then( (file) => {
                const jsonRes = csvtoJSON(file)
                checkTable(filename).then ((check) => {
                    if(typeof check === 'number' & check === 0) {
                        createTable(filename, jsonRes).then ( () => {
                            uploadToMySQL(jsonRes, filename)
                        })
                    } else {
                        console.log("Table already exists")
                    }
                })
            })
            tempToUploads(filename).then( () => console.log("Moved Successfully!"))
        })
    })
}



export {uploadStorage, storage }