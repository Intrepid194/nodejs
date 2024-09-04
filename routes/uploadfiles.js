//import Express to handle HTTP requests
import express from 'express'

import {uploadStorage, storage, uploadCSVFilesToMySQL} from '../middleware/file_processing.js'

const uploadRouter = express.Router()

//GET route for uploading the files to
uploadRouter.get("/upload-files", async (req, res) => {
    res.render("upload-file.ejs")
})

//upload route for csv files
uploadRouter.post("/upload", uploadStorage.array('files', 5), async (req, res) => {
    //console.log(req.file)
    uploadCSVFilesToMySQL()
    return res.send("Uploaded Successfully!")
})

export default uploadRouter
