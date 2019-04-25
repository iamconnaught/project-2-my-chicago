const express = require('express');
const router  = express.Router();
const User 	  = require('../models/users')
const session = require('express-session')
const bcrypt  = require('bcryptjs')


router.get('/login', async (req,res) => {
	try {
		res.render('login.ejs',{
			message: req.session.message
		})	
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

router.post('/login', async (req,res) => {
	try {
		const foundUser = await User.findOne({'username': req.body.username});
		if(foundUser){
			if (bcrypt.compareSync(req.body.password, foundUser.password)=== true) {
				req.session.message = '';
				req.session.logged = true;
				req.session.userDbId = foundUser._id;
				console.log(req.session, ' logged in!');
				res.redirect('/users/:id')
			}else{
				req.session.message = "Username or Password is incorrect";
				res.redirect('/auth/login');
			}

		} else{
			req.session.message = "Username or Password is incorrect";
			res.redirect('/auth/login');
		}



	} catch (err){
		res.send(err)
	}
})


router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/auth/login');
    }
  })
})


module.exports = router;
