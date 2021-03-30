const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('working')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xn8r5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("softBookDB").collection("books");
    console.log('db connected')
    app.get('/books', (req, res) => {
        collection.find()
            .toArray((err, items) => {
                console.log(items)
                res.send(items)
            })
    })
    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        collection.insertOne(newBook)
            .then(result => {
                console.log('inserted count:', result.insertedCount)
                res.send(result.insertedCount > 0)
            })
        console.log(newBook)
    })
});


app.listen(port, () => {
    console.log('server running on port', port);
});


// firebase login
// firebase init
// firebase deploy