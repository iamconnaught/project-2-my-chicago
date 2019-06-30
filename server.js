//REQUIRED MODULES & FILES

const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session 		 = require('express-session')
const bcrypt 		 = require('bcryptjs')

require("dotenv").config();
require('./db/db')


//MIDDLEWARE

app.use(bodyParser.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	})
);

app.use(express.static('public'));


//HOMEPAGE

app.get('/', async (req,res) => {

	try {
		res.render('welcome.ejs')
		
	} catch (err){
		res.send(err)
	}
})


//CONTROLLERS

const authController = require('./controllers/authController');
app.use('/auth', authController);

const userController = require('./controllers/userController');
app.use('/users', userController)

const expController = require('./controllers/expController');
app.use('/experiences', expController);



//CONNECTING TO PORT 
app.listen(process.env.PORT, () => {
	console.log("Listening to PORT");
})