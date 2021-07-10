const express = require('express');
const mongoose =require('mongoose');
const ejs = require('ejs');
const dotenv = require('dotenv');
const moviesRoutes = require('./routes/movies');
const showController = require('./controllers/showController');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const moviesController = require('./controllers/moviesController');
const User = require('./models/Usermodel');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fetch = require('node-fetch');
const methodOverride = require('method-override')

dotenv.config();
const app = express();
app.set('view engine', 'ejs');


mongoose.connect(`mongodb+srv://apurv:${process.env.DATABASE_PASSWORD}@usersdb.ny1cc.mongodb.net/netflixDataBase?retryWrites=true&w=majority`,{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(console.log('Connected to Db!!'));

//middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))
app.use('*', authController.checkUser);
app.use('/movies', moviesRoutes)

//routes
app.get('/', showController.tvShowsPopular);
//authRoutes
app.get('/login', (req, res) => { res.render('login')});
app.get('/signUp', (req, res) => {res.render('signUp')});
app.get('/logout', authController.logout);
app.post('/profile',authController.loginorSignup, authController.getUser);
//userRoutes
app.get('/mylist',userController.getMyList);
app.post('/mylist',userController.addToList);
app.delete('/myList',userController.deleteFromList);
app.listen(process.env.PORT, () =>console.log(`Server running on port ${process.env.PORT}`));
