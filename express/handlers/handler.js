const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const User = require('../models/userModel.js');

const documentationFilePath = 'documentation.json';
const documentation = JSON.parse(fs.readFileSync(documentationFilePath, 'utf8'));

const uploadDirectory = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const imageFormats = ['jpeg', 'png', 'gif'];

router.post('/converter/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.redirect('/converter/upload');
  }

  const fileExtension = path.extname(req.file.originalname).toLowerCase().substr(1);

  if (!imageFormats.includes(fileExtension)) {
    fs.unlinkSync(req.file.path);
    return res.redirect('/converter/upload');
  }

  const selectedFormat = req.body.imageFormat;

  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(req.file.path));
    formData.append('file_type', selectedFormat);

    const djangoResponse = await axios.post('http://127.0.0.1:8000/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'stream'
    });

    res.set('Content-Type', djangoResponse.headers['content-type']);
    res.set('Content-Disposition', djangoResponse.headers['content-disposition']);
    djangoResponse.data.pipe(res);
  } catch (error) {
    console.error(error);
    res.redirect('/converter/upload');
  }
});

router.get('/converter/upload', (req, res) => {
  res.render('uploadFile', { imageFormats });
});


router.get('/help', (req, res) => {
  res.json(documentation);
});

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

router.patch('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedUser = await User.findByIdAndUpdate(userId, updates, options);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/converter/upload', (req, res) => {
  res.render('uploadFile', { imageFormats });
});

router.get('*', (req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

module.exports = router;
