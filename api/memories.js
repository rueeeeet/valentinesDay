const mongoose = require('mongoose');

// Cache the database connection so it doesn't reconnect on every request
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    const db = await mongoose.connect(process.env.MONGO_URI);
    cachedDb = db;
    return cachedDb;
}

const memorySchema = new mongoose.Schema({
    order: Number,
    date: String,
    title: String,
    description: String,
    images: [String],
    videos: [String],
    uploadedBy: String
});

// Prevent Mongoose overwrite model error in serverless environments
const Memory = mongoose.models.Memory || mongoose.model('Memory', memorySchema);

export default async function handler(req, res) {
    // Enable CORS so your frontend can talk to this API safely
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await connectToDatabase();
        const memories = await Memory.find().sort({ order: 1 });
        return res.status(200).json(memories);
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Failed to fetch memories' });
    }
}