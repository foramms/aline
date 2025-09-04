const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/journalApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Register endpoint
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashed });
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1d" });
  res.json({ message: "Login successful", token });
});

// Music recommendations endpoint
app.get("/api/music/recommendations", (req, res) => {
  const { mood } = req.query;
  const moodNum = parseInt(mood) || 3;
  
  // Mock music recommendations based on mood
  const recommendations = {
    1: { // Sad/Depressed
      genres: ['ambient', 'classical', 'instrumental', 'lo-fi'],
      description: 'Gentle, calming tunes to help you process',
      songs: [
        { title: 'Peaceful Mind', artist: 'Ambient Collective', genre: 'ambient' },
        { title: 'Gentle Rain', artist: 'Nature Sounds', genre: 'instrumental' },
        { title: 'Calm Waters', artist: 'Classical Ensemble', genre: 'classical' }
      ]
    },
    2: { // Down
      genres: ['indie', 'folk', 'acoustic', 'chill'],
      description: 'Soothing melodies to lift your spirits',
      songs: [
        { title: 'Morning Light', artist: 'Indie Folk', genre: 'folk' },
        { title: 'Acoustic Dreams', artist: 'Chill Collective', genre: 'acoustic' },
        { title: 'Soft Whisper', artist: 'Indie Artist', genre: 'indie' }
      ]
    },
    3: { // Neutral
      genres: ['pop', 'alternative', 'indie-pop', 'soft-rock'],
      description: 'Balanced music to accompany your thoughts',
      songs: [
        { title: 'Balanced Day', artist: 'Pop Collective', genre: 'pop' },
        { title: 'Alternative Thoughts', artist: 'Alt Band', genre: 'alternative' },
        { title: 'Indie Pop Vibes', artist: 'Indie Pop', genre: 'indie-pop' }
      ]
    },
    4: { // Good
      genres: ['upbeat', 'pop', 'dance', 'happy'],
      description: 'Upbeat tracks to match your positive energy',
      songs: [
        { title: 'Happy Vibes', artist: 'Pop Collective', genre: 'pop' },
        { title: 'Upbeat Energy', artist: 'Dance Crew', genre: 'dance' },
        { title: 'Good Times', artist: 'Happy Band', genre: 'upbeat' }
      ]
    },
    5: { // Great
      genres: ['energetic', 'dance', 'pop', 'rock'],
      description: 'Energetic beats to celebrate your mood!',
      songs: [
        { title: 'Celebration', artist: 'Dance Crew', genre: 'dance' },
        { title: 'Energetic Rock', artist: 'Rock Band', genre: 'rock' },
        { title: 'Party Time', artist: 'Pop Collective', genre: 'pop' }
      ]
    }
  };

  res.json({
    mood: moodNum,
    ...recommendations[moodNum] || recommendations[3]
  });
});

// Start server
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
