'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', (process.env.PORT || 5000));

// Process the data

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', (req, res) => { 
    res.send("Hi i'm a chatbot")
})


// Facebook

app.get('/webhook/', (req, res) => {
    if(req.query['hub.verify_token'] === "token_id") {
        res.send(req.query['hub.challenge'])
    }
    res.send("wrong token")
})
app.post('/webhook/', (req, res) => {
    let messaging_events = req.body.entry[0].messaging_events
    for(let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;
        if(event.message && event.message.text) {
            let text = event.message.text;
            sendText(sender, "Raul: " + text.substring(0, 100))
        }
    }
    res.sendStatus(200)
})

// Get a post from facebook

function sendText(sender, text) {
    let messageData = {text: text}
    request({
        url: "https/graph.facebook.com/v2.6/me/messages",
        qs : {access_token: `${process.env.TOKEN}`},
        method: "POST",
        json: {
            receipt: {id: sender},
            message : messageData
        }
    }, () => {
        if(error) {
            console.log("sending error")
        } else if (Response.body.error){
            console.log("response body error")
        }
    })
}

// Listen

app.listen(app.get('port'), () => {
    console.log("running on port")
})