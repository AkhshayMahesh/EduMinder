const mongoose = require("mongoose")
const Schema = mongoose.Schema

const expenseschema = new Schema({
    user : {
        type: String,
        required: true
    },
    amount : {
        type : Number,
        required : true
    },
    desc : {
        type: String
    },
    type : {
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

const expense = mongoose.model('expense',expenseschema)
module.exports = expense;