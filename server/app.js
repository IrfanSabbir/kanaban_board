require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')

const app = express();

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods','POST,GET,FATCH,PUT,DELETE,OPTIONS');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next()
})


const db = async ()=>{
    try {
        const success = await mongoose.connect(process.env.MONGO_ATLAS_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log("Mongoose is connected" )
    } catch (error) {
        console.log("mongoose: "+ error)
    }
}

db()

app.use(express.json());

const taskApi = require('./tasks/tasks')

app.use('/task', taskApi)

app.listen(process.env.PORT ,()=>{
    console.log(`project running on ${process.env.PORT}`)
})