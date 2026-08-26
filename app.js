require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/authRoutes');
const usersRoute = require('./routes/userRoutes');
const loanRoute = require('./routes/loanRoutes');

app.use(express.json());

// conection variables
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 8080;

app.use(authRoutes);
app.use(usersRoute);
app.use(loanRoute);

app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;

    res.status(status).json({
        meta: {
            statusCode: status,
            error: message
        },
        data: {
            result: data || {}
        }
    });
});

mongoose
  .connect(mongoURI)
  .then(result => {
   app.listen(port, () => {
      console.log('Server started');
    });
  })
  .catch(err => {
    console.log('MongoDB connection failed:', err);
    process.exit(1);
  });