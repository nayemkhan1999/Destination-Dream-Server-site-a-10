const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l4sutcp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const destinationCollection = client
      .db("destinationDB")
      .collection("destination");

    // email
    app.get("/destination_email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await destinationCollection.find(query).toArray();
      res.send(result);
    });
    // Data get
    app.get("/destination", async (req, res) => {
      const cursor = destinationCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Data Post
    app.post("/destination", async (req, res) => {
      const newDestination = req.body;
      console.log(newDestination);
      const result = await destinationCollection.insertOne(newDestination);
      res.send(result);
    });

    //  Data Updated
    app.put("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedDestination = req.body;
      const destination = {
        $set: {
          name: updatedDestination.name,
          Country: updatedDestination.Country,
          spotLocation: updatedDestination.spotLocation,
          averageCost: updatedDestination.averageCost,
          seasonality: updatedDestination.seasonality,
          tavelTime: updatedDestination.tavelTime,
          photo: updatedDestination.photo,
          totalVisitors: updatedDestination.totalVisitors,
          email: updatedDestination.email,
          displayName: updatedDestination.displayName,
          description: updatedDestination.description,
        },
      };
      const result = await destinationCollection.updateOne(
        filter,
        destination,
        options
      );
      res.send(result);
    });

    // App get
    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await destinationCollection.findOne(query);
      res.send(result);
    });

    //Delete operation
    app.delete("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await destinationCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Destination Dreams server site is running");
});

app.listen(port, () => {
  console.log(`Destination Dreams server is running on port:${port}`);
});
