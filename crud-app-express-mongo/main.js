// Import required modules
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

// Create app
const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB config
const MONGO_URI = 'mongodb://localhost:27017';
const DATABASE_NAME = 'SNIST';
let db;

// Connect to MongoDB and start server
MongoClient.connect(MONGO_URI)
    .then(client => {
        console.log('Connected to MongoDB');
        db = client.db(DATABASE_NAME);

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error(err));


// ================= ROUTES =================

// Home - list items
app.get('/', async (req, res) => {
    if (!db) return res.status(500).send('Database not connected');

    try {
        const items = await db.collection('items').find().toArray();
        res.render('index', { items });
    } catch (err) {
        res.status(500).send('Error fetching items');
    }
});

// Show create form
app.get('/create', (req, res) => {
    res.render('create');
});

// Create item
app.post('/create', async (req, res) => {
    if (!req.body.name || !req.body.description) {
        return res.status(400).send('All fields required');
    }

    try {
        await db.collection('items').insertOne({
            name: req.body.name,
            description: req.body.description
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error creating item');
    }
});

// Show edit form
app.get('/edit/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        const item = await db.collection('items').findOne({
            _id: new ObjectId(req.params.id)
        });

        if (!item) return res.status(404).send('Item not found');

        res.render('edit', { item });
    } catch (err) {
        res.status(500).send('Error fetching item');
    }
});

// Update item
app.post('/edit/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        await db.collection('items').updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description
                }
            }
        );
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error updating item');
    }
});

// Delete item
app.post('/delete/:id', async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    try {
        await db.collection('items').deleteOne({
            _id: new ObjectId(req.params.id)
        });
        res.redirect('/');
    } catch (err) {
        res.status(500).send('Error deleting item');
    }
});