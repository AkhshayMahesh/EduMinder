const mongoose = require("mongoose")
const Schema = mongoose.Schema

const eveschema = new Schema({
    user : {
        type: String,
        required: true
    },
    name : {
        type : String,
        required : true
    },
    desc : {
        type : String,
        required : true
    },
    start : {
        type : mongoose.SchemaTypes.Date,
        required : true
    },
    end : {
        type : mongoose.SchemaTypes.Date,
        required : true
    },
    createdAt: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: new Date(),
    }
})

const eve = mongoose.model('eve',eveschema)
module.exports = eve;