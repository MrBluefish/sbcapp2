require('dotenv').config();

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));


mongoose.connect('mongodb://localhost/workoutdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected...'))
.catch(err => console.error(err));

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

const newUser = new User({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
});

newUser.save()
  .then(user => console.log(user))
  .catch(err => console.error(err));


const Workout = mongoose.model('Workout', ExerciseSchema);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db');
});

mongoose.connection.on('error', (err) => {
  console.log(err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection is disconnected.');
});

// If the Node process ends, close the Mongoose connection
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
