const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const blogRoutes = require('./routes/blog-routes');
const homeRoutes = require('./routes/home-routes');

const app = express();
const port = process.env.PORT || 8000;

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//set session for the app..secret is a secret key which is place under .env file
app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
  }));

//initialize passport-package and use passport to handle session
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/blogsite',{useNewUrlParser:true,useUnifiedTopology:true});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use('/',homeRoutes);
app.use('/blog',blogRoutes);

app.listen(port,()=>{console.log(`app is listening at ${port}`)});