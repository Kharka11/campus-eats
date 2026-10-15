const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const { connectMongo } = require('./config/mongo');
if (process.env.NODE_ENV !== 'test') {
  connectMongo().catch(err => console.error('MongoDB connection failed:', err));
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); //Path to views folder

// Static files (CSS, client-side JS)
app.use(express.static(path.join(__dirname, 'public'))); //Make the files inside public available to the browser.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRET || 'campus-eats-dev-secret',
  resave: false,
  saveUninitialized: false,
}));

// Make the logged-in user available to every view, without passing it manually every time
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

module.exports = app;
