const express = require('express');
const router = express.Router();
const User = require('../models/userModel.js');

router.get('/new', (req, res) => {
  res.render('createUser');
});

router.post('/new', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.redirect('/');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
    try {
      const users = await User.find();
      res.render('userList', { users })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.render('userDetail', { user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;
