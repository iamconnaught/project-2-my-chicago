require("dotenv").config();

const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session 		 = require('express-session')
const bcrypt 		 = require('bcryptjs')
require('./db/db')

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false
}))
app.use(express.static('public'));


//AUTH CONTROLLER
const authController = require('./controllers/authController');
app.use('/auth', authController);
//CONTROLLERS
const userController = require('./controllers/userController');
app.use('/users', userController)
const expController = require('./controllers/expController');
app.use('/experiences', expController);


//HOMEPAGE
app.get('/', async (req,res) => {
	try {
		res.render('welcome.ejs')
		
	} catch (err){
		res.send(err)
	}
})

// //auth requirement
// app.use((req,res,next)=>{
// 	if(!req.session.logged){
// 		res.redirect('/auth/login')
// 	}
// })







app.listen(process.env.PORT, () => {
	
})