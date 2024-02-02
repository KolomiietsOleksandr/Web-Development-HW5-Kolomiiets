const express = require('express');
const router = express.Router();
const User = require('../models/userModel.js');

router.get('/', (req, res) => {
  res.render('createUser');
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
