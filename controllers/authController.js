/************************************************
				AUTH CONTROLLER
************************************************/

const express = require('express');
const router  = express.Router();
const User 	  = require('../models/users')
const session = require('express-session')
const bcrypt  = require('bcryptjs')


//LOGIN & REGISTER FORMS PAGE ROUTE

router.get('/login', async (req,res) => {
	try {
		res.render('login.ejs',{
			loginMessage: req.session.loginMessage,
			regMessage: req.session.regMessage
		})	
	} catch (err){
		res.send(err)
	}
});


//REGISTER ROUTE

router.post('/register', async (req,res,next) => {

		try {
			if (req.body.username === "" || req.body.password === "") {

				req.session.regMessage = "Please enter Username or Password"
				res.redirect("/auth/login")

			} else if (req.body.username !== "" || req.body.password !== "") {

				const userExists = await User.findOne({'username': req.body.username});
				
				if (userExists){
					req.session.regMessage = "Username is already taken."
					res.redirect('/auth/login')

				} else if (!userExists) {

				const password = req.body.password;
				const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
				const userDbEntry = {};
				userDbEntry.username = req.body.username;
				userDbEntry.password = passwordHash;

				const createdUser = await User.create(userDbEntry);	
				req.session.logged = true;
				req.session.username =req.body.username
				req.session.userDbId = createdUser._id;
				res.redirect('/users/' + createdUser._id);

				}
			}	

		} catch (err){
			next(err)
		}
	
});


//LOGIN ROUTE

router.post('/login', async (req,res) => {

	try {
		if (req.body.username === "" || req.body.password === "") {

				req.session.loginMessage = "Please enter Username or Password."
				res.redirect("/auth/login")

			}

		const foundUser = await User.findOne({'username': req.body.username});

		if (foundUser){

			if (bcrypt.compareSync(req.body.password, foundUser.password)=== true) {

				req.session.message = '';
				req.session.logged = true;
				req.session.username =req.body.username
				req.session.userDbId = foundUser._id;
				console.log(req.session, ' logged in!');
				res.redirect('/users/' + foundUser._id);

			} else {
				req.session.loginMessage = "Username or Password is incorrect";
				res.redirect('/auth/login');
			}

		} else {
			req.session.loginMessage = "Username or Password is incorrect";
			res.redirect('/auth/login');
		}



	} catch (err){
		res.send(err)
	}
})


//LOGOUT ROUTE

router.get('/logout', (req, res) => {

  req.session.destroy((err) => {

    if(err){
      res.send(err);

    } else {
      res.redirect('/auth/login');
    }

  })

});



module.exports = router;
