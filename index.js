const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://dbuser1:79lwQWaSnq3yURPh@cluster0.abtli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("Alex-store").collection("product");
//   console.log('db connect')
//   // perform actions on the collection object
//   client.close();
// });


async function run() {
  try {
    await client.connect();
    const productsCollection = client.db("Alex-store").collection("product");
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
    app.get('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const products = await productsCollection.findOne(query);
      res.send(products);
    });

    //POST
    app.post('/product', async(req, res)=>{
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    // PRODUCT DELETE
    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    })
  }

  finally {

  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Running Alex Store House');
});

app.listen(port, () => {
  console.log('Listening to port', port);
})