const express = require('express')
const app = express();
const port = 8090;
var axios = require('axios');
var fs = require('fs');
var bodyParser = require('body-parser');
const request = require('request-promise-native');
const mongoHelper = require('./mongoDBHelper');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    mongoHelper.getItem({collection: 'nimble', data: {}}).then((data) => {
        res.send(data);
    }).catch(err => {
        console.log(err);
    })
});


app.get('/yo', (req, res) => {
    res.send("yo man !!!");
});

app.post('/getChannelID', async (req, res) => {
    // ....CODE TO LOGIN USER
    // Creating or login user into Rocket chat
    try {
        const response = await createOrLoginUser(user.username, user.firstName, user.email, user.password);
        req.session.user = user;
        // Saving the rocket.chat auth token and userId in the database
        user.rocketchatAuthToken = response.data.authToken;
        user.rocketchatUserId = response.data.userId;
        await user.save();
        res.send({message: 'Login Successful'});
    } catch (ex) {
        console.log('Rocket.chat login failed');
    }
});




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
