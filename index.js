const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require ("mongodb").ObjectId;
const cors = require("cors");
const { application } = require("express");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gnvic.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("terrific-tours");
      const packageCollection = database.collection("packages");
      const orderCollection = database.collection("orders");
        
    //   POST api to insert service
        app.post("/packages", async(req, res)=>{
            const newPackage = req.body;
            const result = await packageCollection.insertOne(newPackage);
            res.json(result)
        })

    // GET api to get all data
        app.get('/allPackages', async(req,res)=>{
            const cursor = packageCollection.find({});
            const allPackages = await cursor.toArray();
            res.json(allPackages);
        })

    // GET api to get data by id
        app.get("/pack/:id", async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await packageCollection.findOne(query)
            res.json(result);
        })

    // POST api to handle order
        app.post("/pack/booking", async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

    // GET api to view orders
        app.get("/admin/allBookings", async(req, res)=>{
            const cursor = orderCollection.find({});
            const allOrders = await cursor.toArray();
            res.json(allOrders);
        })

    // GET api to get orders by email
        app.get("/myOrders/:email", async(req, res)=>{
            const email = req.params.email
            const query = {email:email}
            const cursor =  orderCollection.find(query);
            const result = await cursor.toArray()
            res.json(result)
        })

    // Delete api for my orders
        app.delete("/myOrders/:id", async(req, res)=>{
            const id = req.params.id;
            const query= {_id:ObjectId(id)}
            const result = await orderCollection.deleteOne(query)
            res.json(result)
        })

    // Delete api for admin
        app.delete("/manageOrders/:id", async(req,res)=>{
            const id = req.params.id;
            const query= {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

    // PUT api to update order status
        // app.put("/booking/update/:id", async(req, res)=>{
        //     const id = req.params.id;
        //     const updatedStatus = req.body;
        //     const filter = {_id: ObjectId(id)};
        //     const options = {upsert: true}
        //     const updateDoc = {
        //         $set: {
        //             status: updatedStatus.status,
        //         }
        //     }
        //     const result = await cursor.updateOne(filter, updateDoc, options);
        //     res.json(result)
        //     console.log(req.body)
        // })
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get("/", (req, res)=>{
    res.send("Hello pakistan")
})

app.listen(port, ()=>{
    console.log("Listening to port", port)
})