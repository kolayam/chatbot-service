const express = require('express')
const app = express();
const port = 8095;
var axios = require('axios');
var fs = require('fs');
var bodyParser = require('body-parser');
const request = require('request-promise-native');
const mongoHelper = require('./mongoDBHelper');

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());



app.get('/', (req, res) => {
    mongoHelper.getItem({collection: 'nimble', data: {}}).then((data) => {
        res.send(data);
    }).catch(err => {
        console.log(err);
    })
});

app.get('/hello', (req, res) => {
    res.send("hello !!!!");
});

app.post('/channel', async (req, res) => {
    console.log("request received to search for create channel: " + req.body);
    mongoHelper.insert({collection: 'nimble', data: req.body}).then(response => {
        res.status(201);
        res.send();
    }).catch(err => {
        res.status(400);
        res.send()
    })
});

app.post('/channels', async (req, res) => {
    console.log("request received to search for channels: " + req.body);
    let channelData = {};
    let initiatingPartyID = req.body.initiatingPartyID;
    let respondingPartyID = req.body.respondingPartyID;

    channelData.catalogueID = req.body.catalogueID;
    channelData.initiatingPartyID = initiatingPartyID;
    channelData.respondingPartyID = respondingPartyID;


    mongoHelper.getItem({collection: 'nimble', data: channelData}).then(firstResponse => {
        console.log("Attempting first query" + JSON.stringify(channelData));
        if (firstResponse.length !== 0) {
            res.status(200);
            res.send({channelName: firstResponse[0]['channelName']});
        }else {
            // modify query
            channelData.initiatingPartyID = respondingPartyID;
            channelData.respondingPartyID = initiatingPartyID;

            mongoHelper.getItem({collection: 'nimble', data: channelData}).then(secondResponse => {
                console.log("response not found, making second call, " + JSON.stringify(channelData));
                if (secondResponse.length !== 0) {
                    res.status(200);
                    res.send({channelName: secondResponse[0]['channelName']});
                }else {
                    res.status(404);
                    res.send();
                }
            });
        }
    }).catch(err => {
        res.status(400);
        res.send()
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
