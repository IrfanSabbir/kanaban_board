const mongoose = require('mongoose')

const Schema = mongoose.Schema

const taskSchema = new Schema({
    project:{
        type: String,
    },
    task:[
        {
            _id: false,
            name : String ,
            category : String 
        }
    ]
   
})

module.exports = mongoose.model('Task', taskSchema)