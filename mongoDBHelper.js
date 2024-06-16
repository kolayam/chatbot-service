const MongoClient = require('mongodb').MongoClient;
const dbName = "rocketchat-oplog";
const url = 'mongodb://doadmin:5t10ghP84Vp92sN6@db-mongodb-kolanot-12798e8c.mongo.ondigitalocean.com/rocketchat-oplog?authSource=admin';
const dbService = {

    /**
     * @param options
     * @returns {Promise}
     */
    insert: options => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                collection.insert(options.data, function (aerr, resp) {
                    if (aerr) {
                        reject(aerr);
                    } else {
                        resolve(resp);
                    }
                });
                client.close();
            });
        });
    },

    /**
     * @param options
     * @returns {Promise}
     */
    insertMany: options => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                collection.insertMany(options.data, function (aerr, resp) {
                    if (aerr) {
                        reject(aerr);
                    } else {
                        resolve(resp);
                    }
                });
                client.close();
            });
        });
    },

    /**
     * @param options
     * @returns {Promise}
     */
    getItem: options => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                collection.find(options.data).toArray(function (aerr, resp) {
                    if (aerr) {
                        reject(aerr);
                    } else {
                        resolve(resp);
                    }
                });
                client.close();
            });
        });
    },

    /**
     * @param options
     * @returns {Promise}
     */
    deleteItem: options => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                const ObjectId = require('mongodb').ObjectID;
                collection.deleteOne(
                    {'_id': ObjectId(options.item_id)}
                    , function (aerr, resp) {
                        if (aerr) {
                            reject(aerr);
                        } else {
                            // logger.info(resp);
                            resolve('ok');
                        }
                    });
                client.close();
            });
        });
    },
    updateItem: options => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                const newvalues = {$set: options.newData};
                collection.updateOne(options.data, newvalues
                    , function (aerr, resp) {
                        if (aerr) {
                            reject(aerr);
                        } else {
                            resolve(`ok ${resp}`);
                        }
                    });
                client.close();
            });
        });
    },

    /**
     * logic to increment counter filed
     * @param options
     * @returns {Promise}
     */
    incrementCounter: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection('counter');
                collection.update({name: 'folderCounter'}, {$inc: {ran: 1}}).then((aerr, resp) => {
                    if (aerr) {
                        reject(aerr);
                    } else {
                        resolve(resp);
                    }
                });
                client.close();
            });
        });
    },

    /**
     * Method Drops Collection
     * @param options
     * @returns {Promise}
     */
    dropCollection: options => {
        return new Promise(resolve => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                db.dropCollection(options.collection, function (aerr, delOK) {
                    if (aerr){
                        // logger.error('Error occurred in droping the collection');
                        resolve({status: false});
                    }else{
                        // logger.info(`Collection deleted, ${delOK} Collection Name : ${options.collection}`);
                        resolve({status: true});
                    }
                    client.close();
                });

            });
        });
    },
    deleteAll: options => {
        return new Promise(resolve => {
            MongoClient.connect(url, function (err, client) {
                const db = client.db(dbName);
                const collection = db.collection(options.collection);
                collection.remove({},function(aerr,resp){
                    if (aerr){
                        // logger.error('Error occurred in droping the collection');
                        resolve({status: false});
                    }else{
                        // logger.info(`Collections deleted ${resp}`);
                        resolve({status: true});
                    }
                });
                client.close();
            });
        });
    }
};

module.exports = dbService;
