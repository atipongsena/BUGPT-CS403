const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./baseconnect');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'C:/Users/bossk/ChatApp/frontend')));

// Serve static files for all routes except API endpoints
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../frontend', 'src', 'pages', 'Signup.jsx'));
  } else {
    next();
  }
});

// API endpoint for user signup
app.post('/api/signup', async (req, res) => {
  console.log("Received data:", req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      fullName: req.body.fullName,
      studentId: req.body.studentId,
      email: req.body.email,
      password: hashedPassword,
      chathistory: [],
    });
    const result = await newUser.save();
    console.log('User registered successfully:', result);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  const { loginIdentifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { studentId: loginIdentifier }]
    });

    if (user && await bcrypt.compare(password, user.password)) {
      console.log('Login successful:', user.username);
      res.status(200).json({ message: 'Login successful', username: user.username });
    } else {
      res.status(401).json({ message: 'Login failed: Incorrect username/student ID or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});

// API endpoint to get chat history for a user
app.get('/api/chathistory/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json({ chathistory: user.chathistory });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});

// API endpoint to save chat history for a user
app.post('/api/chathistory/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      user.chathistory = req.body.chathistory;
      await user.save();
      res.status(200).json({ message: 'Chat history saved successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});

// API endpoint to delete specific chat history for a user
app.delete('/api/chathistory/:username/:index', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      user.chathistory.splice(req.params.index, 1);
      await user.save();
      res.status(200).json({ message: 'Chat history deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});


// API endpoint to update user details
app.post('/api/updateUser', async (req, res) => {
  const { username, fullName, email, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      user.fullName = fullName;
      user.email = email;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error', details: error.toString() });
  }
});



const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
