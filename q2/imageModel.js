const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
    },
    alt: {
        type: String,
    },
    url: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Image', imageSchema)