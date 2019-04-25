const express = require('express');
const router  = express.Router();
const User 	  = require('../models/users')
const session = require('express-session')
const bcrypt  = require('bcryptjs')


router.get('/login', async (req,res) => {
	try {
		res.render('login.ejs')	
	} catch (err){
		res.send(err)
	}
})

router.post('/register', async (req,res) => {
	const password = req.body.password;
	const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

	const userDbEntry = {};
	userDbEntry.username = req.body.username;
	userDbEntry.password = passwordHash;

	try {
		const createdUser = await User.create(userDbEntry);	
		req.session.logged = true;
		req.session.usersDbId = createdUser._id;
		console.log(createdUser);

		res.redirect('/users/:id')
	} catch (err){
		res.send(err)
	}
})

router.post('/login', (req,res) => {
	req.session.username = req.body.username;
	req.session.logged = true;
	res.redirect('/users')
	console.log(req.session);
})

module.exports = router;
