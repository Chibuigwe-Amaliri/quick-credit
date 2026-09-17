require('dotenv').config();
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');

const app = express();

const authRoutes = require('./routes/authRoutes');
const usersRoute = require('./routes/userRoutes');
const loanRoute = require('./routes/loanRoutes');
const adminRoute = require('./routes/adminRoutes');

// conection variables
const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 4000;
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));


app.use(authRoutes);

app.use(usersRoute);

app.use(adminRoute);

app.use(loanRoute);

app.use((error, _req, res, _next) => {
    if (error.code === 11000) {
        error.statusCode = 409;
        error.message = "A record with the provided details already exists";
    }
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
  .then(() => {
   app.listen(port, () => {
      console.log('Server started');
    });
  })
  .catch(err => {
    console.log('MongoDB connection failed:', err);
    //process.exit(1);
  });