const express = require('express');
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/database');
const storyRoutes = require('./routes/stories');
const commentRoutes = require("./routes/comments");
const authRoutes = require('./routes/auth');
const MongoStore = require('connect-mongo');
const { db } = require('./models/Story');
require("dotenv").config();

//Passport configuration
require('./config/passport')(passport)

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

//Session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
    })
)

//Use forms for put/delete
app.use(methodOverride("_method"));


//Middlewares
app.use(passport.initialize())
app.use(passport.session())

//Setting globals
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})


//Routes
app.get("/", (request, response) => {
    response.render('index')
})

app.use('/auth', authRoutes)
app.use('/api/stories', storyRoutes)
app.use("/comment", commentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`)
})