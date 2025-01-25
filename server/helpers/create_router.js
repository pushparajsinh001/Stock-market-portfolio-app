const express = require('express');
const { ObjectId } = require('mongodb');

const createRouter = (collection) => {
  const router = express.Router();

  // Helper function to handle errors
  const handleError = (res, err) => {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  };

  // GET all documents with optional pagination
  router.get('/', async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    try {
      const docs = await collection.find().skip(skip).limit(limit).toArray();
      const total = await collection.countDocuments();
      res.json({ success: true, data: docs, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
      handleError(res, err);
    }
  });

  // GET a single document by ID
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    try {
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
      res.json({ success: true, data: doc });
    } catch (err) {
      handleError(res, err);
    }
  });

  // POST - Create a new document
  router.post('/', async (req, res) => {
    const newData = req.body;
    try {
      const result = await collection.insertOne(newData);
      res.status(201).json({ success: true, data: result.ops[0] });
    } catch (err) {
      handleError(res, err);
    }
  });

  // DELETE - Remove a document by ID
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }
      res.json({ success: true, message: 'Document deleted' });
    } catch (err) {
      handleError(res, err);
    }
  });

  // PUT - Update a document by ID
  router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid ID format' });
    }

    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, error: 'Document not found' });
      }

      res.json({ success: true, message: 'Document updated' });
    } catch (err) {
      handleError(res, err);
    }
  });

  return router;
};

module.exports = createRouter;