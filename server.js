const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const session 		 = require('express-session')
const bcrypt 		 = require('bcryptjs')
require('./db/db')

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
	secret: 'fjkhjdsahlkjfhlkahLKJhfdjklHLJFHLJKFhflkjHDsflkjh',
	resave: false,
	saveUninitialized: false
}))
app.use(express.static('public'));

const expController = require('./controllers/expController');
app.use('/experiences', expController);
const userController = require('./controllers/userController');
app.use('/users', userController)
const authController = require('./controllers/authController');
app.use('/auth', authController);

app.get('/', async (req,res) => {
	try {
		res.render('welcome.ejs')
		
	} catch (err){
		res.send(err)
	}
})

// app.get('/mychicago/login', async (req,res) => {
// 	try {
// 		res.render('login.ejs')	
// 	} catch (err){
// 		res.send(err)
// 	}
// })

// app.post('mychicago/register', async (req,res) => {
// 	const password = req.body.password;
// 	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSynce(10))

// 	const userDbEntry = {};
// 	userDbEntry.username = req.body.username;
// 	userDbEntry.password = passwordHash;

// 	try {
// 		const createdUser = await User.create(userDbEntry);	
// 		req.session.logged = true;
// 		req.session.usersDbId = createdUser._id;
// 		console.log(createdUser);

// 		res.redirect('/users/:id')
// 	} catch (err){
// 		res.send(err)
// 	}
// })

// app.post('/mychicago/login', (req,res) => {
// 	req.session.username = req.body.username;
// 	req.session.logged = true;
// 	res.redirect('/users')
// 	console.log(req.session);
// })




app.listen(3000, () => {
	console.log('listening on port 3000');
})