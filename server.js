const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Backend connected to MongoDB Atlas! 💕'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema
const memorySchema = new mongoose.Schema({
    order: Number,
    date: String,
    title: String,
    description: String,
    images: [String],
    videos: [String],
    uploadedBy: String
});
const Memory = mongoose.model('Memory', memorySchema);

// API Route to fetch memories (Sorted by the 'order' field!)
app.get('/api/memories', async (req, res) => {
    try {
        const memories = await Memory.find().sort({ order: 1 });
        res.json(memories);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));