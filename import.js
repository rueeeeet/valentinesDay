const mongoose = require('mongoose');
require('dotenv').config(); // Make sure you have your .env file with MONGO_URI

// Define the exact schema matching your JSON
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
const memoriesData = require('./memories.json');

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB Atlas successfully! 💕');

        // Clear out any old data to prevent duplicates
        await Memory.deleteMany({});
        console.log('Previous collection cleaned.');

        // Insert your 21 memories
        await Memory.insertMany(memoriesData);
        console.log(`Successfully inserted ${memoriesData.length} memories into MongoDB Atlas! 💖✨`);

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();