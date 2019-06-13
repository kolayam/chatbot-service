const express = require('express')
const app = express();
const port = 8090;
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
    mongoHelper.insert({collection: 'nimble', data: req.body}).then(response => {
        res.status(200);
        res.send();
    }).catch(err => {
        res.status(400);
        res.send()
    })
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
