const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Experience = require('../models/experiences')


router.get('/', async (req,res) => {
	try {
		const foundUsers = await User.find({});
		res.render('users/index.ejs', {
			users:foundUsers
		})	
	} catch (err){
		res.send(err)
	}
})

router.get('/:id', async (req,res) => {
	try {
		const foundUser = await User.findById(req.session.userDbId).populate('experience')

		console.log(foundUser);

		res.render('users/show.ejs', {
			user: foundUser
		})

	} catch (err){
		res.send(err)
	}
})








module.exports = router;