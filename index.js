const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
    const OrderCollection = client.db("softBookDB").collection("orders");
    console.log('db connected')
    app.get('/books', (req, res) => {
        collection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })
    app.post('/addBook', (req, res) => {
        const newBook = req.body;
        collection.insertOne(newBook)
            .then(result => {
                res.send(result.insertedCount > 0)
            })

    })

    app.delete('deleteBook/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        collection.findOneAndDelete({ _id: id })
            .then(documents => res.send(documents.value))

    })

    app.get('/book/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        collection.find({ _id: id })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/checkout', (req, res) => {
        const newCheckout = req.body;
        OrderCollection.insertOne(newCheckout)
            .then((result) => {
                res.status(200).send('inserted')
                console.log('checkout:', newCheckout);
            })
    })

    app.get('/orders', (req, res) => {
        OrderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});


app.listen(port, () => {
    console.log('server running on port', port);
});


// firebase login
// firebase init
// firebase deploy