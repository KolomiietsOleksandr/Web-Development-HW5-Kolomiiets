const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://kolomiiets:zakerden1234@cluster.krs1fzc.mongodb.net/';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

module.exports = mongoose.connection;
