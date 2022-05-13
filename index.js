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
    app.get('/buses', async (req, res) => {
      const query = {};
      const cursor = busCollection.find(query);
      const buses = await cursor.limit(6).toArray();
      res.send(buses)
    })
    app.get('/bus/:id', async(req, res)=>{
      console.log(req.params)
      const id = req.params.id;
      const query= {_id: ObjectId(id)}
      const bus = await busCollection.findOne(query)
      res.send(bus)
    })

    app.get('/allbuses', async (req, res) => {
      const query = {};
      const cursor = busCollection.find(query);
      const buses = await cursor.toArray();
      res.send(buses)
    })

    // Post api for add item
    // http://localhost:5000/bus
    app.post('/bus', async(req, res)=>{
      const data = req.body;
      console.log(data)
      const newItem = await busCollection.insertOne(data)
      res.send(newItem)

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