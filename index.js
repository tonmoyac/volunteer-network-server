const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqzli.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;



const app = express()
app.use(bodyParser.json());
app.use(cors());


const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const eventCollection = client.db("VolunteerNetwork").collection("events");
  const regInformationCollection = client.db("VolunteerNetwork").collection("registration");
  const selectedEventCollection = client.db("VolunteerNetwork").collection("selectedEvents");
 
// Show All events in Ui
  app.get('/events', (req, res) => {
    eventCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Save Registration dat On Database
  app.post('/registration', (req, res) => {
    const events = req.body;
    regInformationCollection.insertOne(events)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  });

  // Save User Selected Event/Organization data
  app.post('/selectedEvents', (req, res) => {
    const selectedEvents = req.body;
    selectedEventCollection.insertOne(selectedEvents)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  });
  // Show User Selected Event/Organization data on Ui
  app.get('/selectedEventData', (req, res) => {
    selectedEventCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
      console.log(documents);
    })
    })
    // delete User Selected Event/Organization
  app.delete('/deleteEvent/:id', (req,res) => {
    selectedEventCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      console.log(result)
    })
  })
})

app.listen(process.env.PORT || port)