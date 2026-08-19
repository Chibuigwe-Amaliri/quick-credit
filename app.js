require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/authRoutes');
const usersRoute = require('./routes/userRoutes');

app.use(express.json());

// conection variables
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 8080;

app.use(authRoutes);
app.use(usersRoute);

mongoose.connect(mongoURI)
.then(result => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(err => {
    console.log(err);
  });