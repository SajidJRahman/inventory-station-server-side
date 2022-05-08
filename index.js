const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.f7xnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const products = client.db("inventoryStation").collection("products");

        // GET API
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = products.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // POST API
        app.post('/products', async (req, res) => {
            const insertedProducts = req.body;
            const result = await products.insertOne(insertedProducts);
            res.send(result);
        });

        // GET API For Single ID
        app.get('/products/:id', async (req, res) => {
            const productsId = req.params.id;
            const query = { _id: ObjectId(productsId) };
            const result = await products.findOne(query);
            res.send(result);
        });

        // DELETE API
        app.delete('/products/:id', async (req, res) => {
            const productsId = req.params.id;
            const query = { _id: ObjectId(productsId) };
            const result = await products.deleteOne(query);
            res.send(result);
        });

        // UPDATE, PATCH OR PUT API
        app.put('/products/:id', async (req, res) => {
            const productsId = req.params.id;
            const newQuantity = req.body;
            const query = { _id: ObjectId(productsId) };
            const options = { upsert: true };
            const updatedQuantity = {
                $set: {
                    quantity: newQuantity.quantity
                }
            };
            const result = await products.updateOne(query, updatedQuantity, options);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('warehouse-management');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})