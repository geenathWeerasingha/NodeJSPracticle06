const express = require('express')
const path = require('path')
const multer = require('multer')


const app = express()
app.use(express.static(path.join(__dirname, 'css')))

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if(file.mimetype == 'application/msword' || file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            return cb(null, true)
        }
        else{
            cb('Accepted file type: .doc only')
        }
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/',upload.array('doc', 10), (req, res) => {
    
    res.send(`
    <style>
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
        }
        a {
            text-decoration: none;
            color: #fff;
            padding: 10px;
            background-color: #000;
        }
    </style>
    <div class="container">
        <h1>File(s) uploaded</h1>
        <a href="/">Upload Another File</a>
    </div>
    `)
})

app.listen(7800, () => console.log('Server started on port 7800'))
