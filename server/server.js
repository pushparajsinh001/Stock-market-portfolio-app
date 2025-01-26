require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const createRouter = require('./helpers/create_router');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT; 
const MONGO_URI = process.env.MONGO_URI; // MongoDB URI from .env file

app.use(cors());
app.use(express.json());

const startServer = async () => {
  const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('portfolio'); // Use the same database name
    const sharesCollection = db.collection('shares');
    const sharesRouter = createRouter(sharesCollection);
    app.use('/api/shares', sharesRouter);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit if the connection fails
  }

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Closing database connection...');
    await client.close();
    console.log('Database connection closed');
    process.exit(0);
  });
};

startServer();
