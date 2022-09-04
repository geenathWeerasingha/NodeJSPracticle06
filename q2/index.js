const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Image = require('./imageModel.js')
const upload = require('./uploader.js')

mongoose.connect('mongodb://localhost:27017/DBRad', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to MongoDB'))

const app = express()

app.use(express.static(path.join(__dirname, 'css')))
app.use(express.static(path.join(__dirname, 'uploads')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    Image.find()
    .then(images => {
        res.render('index', { images: images })
    })
    .catch(err => {
        console.log(err)
    })
})

app.post('/', upload.single('imgs'), (req, res) => {
    let image = new Image({
        caption: req.body.caption,
        alt: req.body.alt,
    })
    if(req.file) image.url = req.file.filename
    image.save()
    .then(() => {
        res.redirect('/')
    })
    .catch(err => console.log(err))
})


app.listen(7750, () => console.log('Server is running on port 7750'))

