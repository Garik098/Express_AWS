const express = require('express')
const AWS = require('aws-sdk')
const url = require('url')
const app = express()
const approuter = express.Router()
const configuration = require('./config')


approuter.get("/deviceshadow", function(req,response){
    if(req.query.thingname == null){
        response.status(400).send("Please specify thingname")
    }
    else{
        var payload = {}
        var shadow = new AWS.IotData({endpoint: configuration.thingendpoint})
        var params = {
            'thingName': req.query.thingname
        }
        try{
            shadow.getThingShadow(params, async function(err, res){
                if (err){
                    response.status(404).send(err.message)
                }
                else{
                    payload = await (res.payload)
                    response.status(200).send(JSON.parse(payload))
                }
            })
        }catch(e){
            response.status(500).send("Error encountered while accesing the shadow")
        }
    }
})

module.exports = approuter