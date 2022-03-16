const app = require('./server');
const { MongoClient } = require("mongodb");

const username = encodeURIComponent('JoeDeSantis1');
const password = encodeURIComponent('3rHotxcRuhJ5ryUu');
const clusterUrl = 'leastbusy.72yem.mongodb.net';

const authMechanism = 'DEFAULT';

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/admin?authMechanism=${authMechanism}&poolSize=20&retryWrites=true&w=majority&wtimeout=5000`;

const port = 4000;

const client = MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

let userCollection;

const run = async () => {
    try{
        await client.connect();
        console.log('Connected to Mongo Atlas Cluster');
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        })
        userCollection = await client.db('least_busy').collection('users');
        console.log('Using user collection')
    } catch(e) {
        console.error(`There was an issue connecting to Mongo Atlas: ${e}`)
        process.exit(1);
    }
}

run();

// MongoClient.connect(
//     uri, 
//     {useNewUrlParser: true, useUnifiedTopology: true}
// ).catch(err => {
//     console.error(err);
//     console.log('Unable to Connect');
//     process.exit(1);
// }).then(client => {
//     userConnection(client);
//     app.listen(port, () => {
//         console.log(`listening on port ${port}`);
//     })}
// )

module.exports = { userCollection };

