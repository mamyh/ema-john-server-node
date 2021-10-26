const express = require('express');
const { MongoClient, CURSOR_FLAGS } = require('mongodb');
const cors = require('cors');



require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000

//middleware 
app.use(cors());
app.use(express.json())
//connect mongodb
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lt029.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('ema-john');
        const productsCollections = database.collection('products');
        //GET PRODUCTS API
        app.get('/products', async (req, res) => {

            const сursor = productsCollections.find({});
            const page = parseInt(req.query.page || 0);
            const size = parseInt(req.query.size || 10);
            const count = await сursor.count();
            let products;
            if (page) {
                products = await сursor.skip(page * size).limit(size).toArray();
            } else {
                products = await сursor.limit(size).toArray();
            }

            res.send({ count, products });
        });
    } finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log('listening to the port ', port)
})