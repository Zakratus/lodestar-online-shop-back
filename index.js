require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { routes } = require('./src/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// Middlewares
const errorMiddleware = require('./src/middlewares/error.middleware');


const PORT = process.env.PORT || 3000;

// Inicialize app
const app = express();

app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Inicialize routes
routes.forEach(item => {
  app.use(`/api/v1/${item}`, require(`./src/routes/${item}`));
});
app.use(errorMiddleware);

// Set data-base
function start() {
  try {
    const start = Date.now();
    mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(res => {
      console.log(`MongoDB connected in ${Date.now() - start}ms`);

      app.listen(PORT, () => {
        console.log(`Server has been started on port ${PORT}...`);
      });
    })

  } catch (err) {
    console.log(err);
  }
}

start();
