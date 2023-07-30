const mongoose = require("mongoose")
const Schema = mongoose.Schema

const creditschema = new Schema({
    user : {
        type: String,
        required: true
    },
    amount : {
        type : Number,
        required : true
    },
    desc : {
        type: String,
        required: true
    },
    date : {
        type : mongoose.SchemaTypes.Date,
        required : true
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    }
})

const credit = mongoose.model('credit',creditschema)
module.exports = credit;