const serverless = require('serverless-http')
const express = require('express')
const app = express()
app.use(express.json())

const router = require('./v1router.js')
app.use('/v1', router)
app.get('/', function(req,res){
    res.status(200).send("hello")
})

exports.handler = serverless(app)