const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

    app.post('/login', async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
          expiresIn: '1d'
      });
      res.send({ accessToken });
  })

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
    });
    
    // PUT
    app.put("/service/:id", async (req, res) => {
      const id = req.params.id;

      // const updateQuantity = req.body;

      // const serviceDelevary = updateQuantity.quantity -1;

      const filter = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(filter)
      console.log(product)
      // const options = { upsert: true };
      const updateProduct = {
        $set: {
          quantity: product.quantity -1 

        },
      };
      const result = await productsCollection.updateOne(filter, updateProduct);
      console.log(result);
      res.send(result);
    });
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