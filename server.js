const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const userRoutes = require('./routes/user');
const placesRoutes = require('./routes/places');
const ampStakeRoutes = require('./routes/ampStake');

const app = express();
const port = process.env.PORT || 8000;


// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/user/', userRoutes);
app.use('/places/', placesRoutes);
app.use('/ampStake/', ampStakeRoutes)


app.get('/', (req, res, next) => {
    res.send('Least Busy Backend Server is up and running!');
})

mongoose.connect(process.env.CONNECTION_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(port, () => console.log(`Server listening on port: ${port}`)))
    .catch((error) => console.log(error));