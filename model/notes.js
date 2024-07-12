
const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    questionUrl:{
        type:String
    },
    solution:{
        type:String
    },
    isShareable:{
        type:Boolean,
        default:false
    },
    isQuestion:{
        type:Boolean,
        default:false
    }
})

const Note = mongoose.model('Note',noteSchema)

module.exports = Note;