const express = require('express');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const MONGO_URL = "mongodb+srv://mh15721812:15721812@cluster0.owthrxo.mongodb.net/storybooks?retryWrites=true&w=majority"
//const helmet = require("helmet");
const connectDB = require('./config/db');
const morgan = require('morgan');
const path = require('path');
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const exphbs = require('express-handlebars');
const engine = exphbs.engine;
//const cros = require('cros');
// Load Config
dotenv.config({ path: './config/config.env' });

// Passport congig
require('./config/passport')(passport);


connectDB();

const app = express();


//app.use(cros({origin:'*',meth}}));
// app.use(helmet()); 
// Body parser 
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Methods override
app.use(methodOverride( (req, res)=> {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// Logging 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// handlebars helpers
const { formatDate, truncate, editIcon, stripTags,select } = require('./helpers/hbs');


// handlebars 
app.engine('.hbs', engine(
    {
        helpers: { formatDate, editIcon, stripTags, truncate,select },
        defaultLayout: 'main',
        extname: '.hbs'
    }));
app.set('view engine', '.hbs');
app.set('views', './views');

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:MongoStore.create({mongoUrl:MONGO_URL}) //process.env.MONGO_URL
}))

// Passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// Set global var
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next()
})

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 1812
app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} `)
)