const mongoHelper = require('./mongoDBHelper');

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

async function persistChannelData(initiatingCompanyID, respondingCompanyID, catalogID, channelName) {
    let options = {};
    mongoHelper.insert();
}


var exports = module.exports = {};

exports.createUser = function (data) {
    return createUser(data);
};
