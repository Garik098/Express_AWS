const serverless = require('serverless-http')
const AWS = require('aws-sdk')
const express = require('express')
const configuration = require('./config')
const app = express()
app.use(express.json())
AWS.config.region = configuration.region

app.get('/v1/deviceshadow', (req,response) => {
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

var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("listening")
})

module.exports = app;
