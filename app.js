const express = require('express');
const app = express();
const mongoConnection = require('./configs/mongoConnection');
const indexRouter = require('./handlers/handler');

app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
