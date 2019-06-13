const express = require('express')
const app = express();
const port = 8090;
var axios = require('axios');
var fs = require('fs');
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// http://localhost:8080/api/v1/rocket_chat_iframe
// http://localhost:8080/api/v1/rocket_chat_auth_get

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/login', async (req, res) => {
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
})

// This method will be called by Rocket.chat to fetch the login token
app.get('/api/v1/rocket_chat_auth_get', (req, res) => {
    // if (req.session.user && req.session.user.rocketchatAuthToken) {
    //     res.send({ loginToken: ctx.session.user.rocketchatAuthToken })
    //     return;
    // } else {
    //     res.status(401).json({ message: 'User not logged in'});
    //     return;
    // }
    axios.post('http://localhost:3000/api/v1/login', {
        username: 'new-user',
        password: 'new-users-passw0rd'
    }).then(function (response) {
        if (response.data.status === 'success') {

            // since this endpoint is loaded within the iframe, we need to communicate back to rocket.chat using `postMessage` API
            res.set('Content-Type', 'text/html');
            res.send(`<script>
				window.parent.postMessage({
					event: 'login-with-token',
					loginToken: '${ response.data.data.authToken }'
				}, 'http://localhost:3000'); // rocket.chat's URL
				</script>`);
        }
    }).catch(function() {
        res.sendStatus(401);
    });
})

// This method will be called by Rocket.chat to fetch the login token
// and is used as a fallback
app.get('/rocket_chat_iframe', (req, res) => {

    axios.post('http://localhost:3000/api/v1/login', {
        username: 'new-user',
        password: 'new-users-passw0rd'
    }).then(function (response) {
        if (response.data.status === 'success') {

            // since this endpoint is loaded within the iframe, we need to communicate back to rocket.chat using `postMessage` API
            res.set('Content-Type', 'text/html');
            res.send(`<script>
				window.parent.postMessage({
					event: 'login-with-token',
					loginToken: '${ response.data.data.authToken }'
				}, 'http://localhost:3000'); // rocket.chat's URL
				</script>`);
        }
    }).catch(function() {
        res.sendStatus(401);
    });
})

const request = require('request-promise-native')

const rocketChatServer = 'http://localhost:3000';
const rocketChatAdminUserId = 'TmKrxkvr8iS44iXEr';
const rocketChatAdminAuthToken = 'lJXgcHUvx57Wor0ySF9IWJTQV9wfNTMjoLjBWLSGiNV';

async function fetchUser (username) {
    const rocketChatUser = await request({
        url: `${rocketChatServer}/api/v1/users.info`,
        method: 'GET',
        qs: {
            username: username
        },
        headers: {
            'X-Auth-Token': rocketChatAdminAuthToken,
            'X-User-Id': rocketChatAdminUserId
        }
    });
    return rocketChatUser;
}

async function loginUser (email, password) {
    const response = await request({
        url: `${rocketChatServer}/api/v1/login`,
        method: 'POST',
        json: {
            user: email,
            password: password
        }
    });
    return response;
}

async function createUser(username, name, email, password) {
    const rocketChatUser = await request({
        url: `${rocketChatServer}/api/v1/users.create`,
        method: 'POST',
        json: {
            name,
            email,
            password,
            username,
            verified: true
        },
        headers: {
            'X-Auth-Token': rocketChatAdminAuthToken,
            'X-User-Id': rocketChatAdminUserId
        }
    });
    return rocketChatUser;
}

async function createOrLoginUser (username, name, email, password,) {
    try {
        const user = await fetchUser(username);
        // Perfom login
        return await loginUser(email, password);
    } catch (ex) {
        if (ex.statusCode === 400) {
            // User does not exist, creating user
            const user = await createUser(username, name, email, password);
            // Perfom login
            return await loginUser(email, password);
        } else {
            throw ex;
        }
    }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
