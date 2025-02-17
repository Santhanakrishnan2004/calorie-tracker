const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create the Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB URI (replace with your local or cloud MongoDB URI)
const mongoURI = "mongodb+srv://skvskv:skvskv@cluster0.cv9b7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Define Calorie Data Schema
const calorieDataSchema = new mongoose.Schema({
  date: Date,
  dayOfWeek: String,
  caloriesConsumed: Number,
  caloriesBurned: Number,
  netCalories: Number,
  weight: Number,
  notes: String
});

const CalorieData = mongoose.model('CalorieData', calorieDataSchema);

// API Routes
// Get all calorie records
app.get('/api/calorieData', async (req, res) => {
  try {
    const calorieData = await CalorieData.find();
    res.json(calorieData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Add new calorie record
app.post('/api/calorieData', async (req, res) => {
  const { date, dayOfWeek, caloriesConsumed, caloriesBurned, netCalories, weight, notes } = req.body;

  const newRecord = new CalorieData({
    date, dayOfWeek, caloriesConsumed, caloriesBurned, netCalories, weight, notes
  });

  try {
    await newRecord.save();
    res.status(201).json({ message: 'Record added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding record' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
