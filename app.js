const express = require('express');
const app = express();
const mongoConnection = require('./configs/mongoConnection');
const indexRouter = require('./routes/index');

app.use(express.json());
app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));
