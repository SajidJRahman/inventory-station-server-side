const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.f7xnm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        await client.connect();
        const products = client.db("inventoryStation").collection("products");

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = products.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const insertedProducts = req.body;
            const result = await products.insertOne(insertedProducts);
            res.send(result);
        })
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