require('./models/User');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(userRoutes);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})