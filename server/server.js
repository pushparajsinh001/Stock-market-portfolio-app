const express = require('express');
const app = express();
const { MongoClient } = require('mongodb'); 
const createRouter = require('./helpers/create_router');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection String
const uri = "mongodb+srv://savage:savage@pushparajsinh001.bbqyp.mongodb.net/"; 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(async () => {
    console.log('Connected to MongoDB Atlas');
    const db = client.db('portfolio'); // Use the same database name
    const sharesCollection = db.collection('shares');
    const sharesRouter = createRouter(sharesCollection);
    app.use('/api/shares', sharesRouter);
  })
  .catch(err => console.error('Could not connect to MongoDB Atlas:', err));

app.listen(5000, function(){
  console.log(`Listening on port ${ this.address().port }`);
});