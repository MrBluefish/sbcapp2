require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

app.use(express.json()); // Using Express's built-in middleware
app.use(express.static('public'));

const ExerciseSchema = new mongoose.Schema({
  muscleGroup: String,
  exercises: [{
    name: String,
    date: Date,
    sets: [{
      weight: Number,
      reps: Number
    }]
  }]
});

const Workout = mongoose.model('Workout', ExerciseSchema);

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection closed through app termination');
    process.exit(0);
  });
});

app.post('/workout', async (req, res) => {
  try {
      const { muscleGroup, exercises } = req.body;
      const workout = new Workout({ muscleGroup, exercises });
      await workout.save();
      res.status(201).json(workout);
    } catch (error) {
      res.status(500).json({ message: 'No Rep...Try again', error: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});