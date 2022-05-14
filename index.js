const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())


// lVXdyWmDP8IRJuoH  user


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.1psxw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect()
    const busCollection = client.db("busStock").collection("bus");
    // api for load all item
    app.get('/allbuses', async (req, res) => {
      const query = {};
      const cursor = busCollection.find(query);
      const buses = await cursor.toArray();
      res.send(buses)
    })
    // api for load sing item
    app.get('/bus/:id', async(req, res)=>{
      const id = req.params.id;
      const query= {_id: ObjectId(id)}
      const bus = await busCollection.findOne(query)
      res.send(bus)
    })

    // Post api for add item
    app.post('/bus', async(req, res)=>{
      const data = req.body;
      const newItem = await busCollection.insertOne(data)
      res.send(newItem)
    })

    // delete api
    app.delete('/allbuses/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const deleteItem = await busCollection.deleteOne(query);
      res.send(deleteItem)
    })

    // api for update 
    app.put('/allbuses/:id', async(req, res)=>{
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
           quantity: data.quantity
        },
      };
      const result = await busCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })
  }
  finally {

  }
} 
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})