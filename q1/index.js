const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const session = require('express-session')

const UserLogin = require('./userModel.js')


mongoose.connect('mongodb://localhost:27017/DBRad', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => console.log('Connected to MongoDB'))
db.on('error', err => console.log(err))

const app = express()

app.use(express.static(path.join(__dirname, 'css')))

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(session({
    
    secret: 'sarah',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


passport.use(new localStrategy(
    {usernameField: 'email'},
    function verify(email, password, cb) {
        UserLogin.findOne({email: email}, (err, user) => {
            if (err) return cb(err)
            if (!user) return cb(null, false)
            if (user.password !== password) return cb(null, false)
            return cb(null, user)
        })
    }
))

passport.serializeUser((user, cb) => cb(null, user.id))
passport.deserializeUser((id, cb) => UserLogin.findById(id, (err, user) => cb(err, user)))

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/login')
}

const isLoggedOut = (req, res, next) => {
    if (!req.isAuthenticated()) return next()
    res.redirect('/')
}

app.get('/', isLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))

})

app.get('/login',isLoggedOut, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'))
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.redirect('/')
        res.redirect('/login')
    })
})

//port
app.listen(7500, () => {
    console.log('Server is up on port 7500.')
})