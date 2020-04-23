const serverless = require('serverless-http')
const AWS = require('aws-sdk')
const express = require('express')
const configuration = require('./config')
const flat = require('flat')
const unflatten = require('flat').unflatten
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

app.post('/v1/newparameter', (req, response) =>{
    console.log(req.body)
    if(req.body == null){
        response.status(200).send("No body to post")
    }
    else{
        if(req.query.thingname == null){
            response.status(200).send("No thingname present")
        }
        else{
            var payload = {
                "state":{
                    "desired":{

                    }
                }
            }
            payload.state.desired = req.body
            var updatethingshadowparams = {
                'thingName': req.query.thingname,
                'payload': JSON.stringify(payload)
            }
            var promise = new Promise(function(resolve, reject) {
                let shadow = new AWS.IotData({endpoint: configuration.thingendpoint})
                shadow.updateThingShadow(updatethingshadowparams, (err, res) => {
                    if(err){
                        reject(err)
                    }
                    else{
                        resolve(res)
                    }
                })
            })
            promise.then(function(res){
                console.log(res)
                response.status(200).send("successfully completed posting to the shadow")
            })
            promise.catch(function(err){
                response.status(500).send("Posting to shadow not successful")
            })
        }
        
    }
})

var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
    console.log("listening")
})

module.exports = app;
