const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Experience = require('../models/experiences')


router.get('/', async (req,res) => {
	try {
		const foundUsers = await User.find({}); 
		console.log("\nfoundUsers in the user indx route");
		console.log(foundUsers);
		res.render('users/index.ejs', {
			users:foundUsers
		})	
	} catch (err){
		res.send(err)
	}
})

// show
router.get('/:id', async (req,res) => {
	try {
		const foundUser = await User.findById(req.params.id).populate('experience')

		console.log("\nhere is found user (based on session) in user show route");
		console.log(foundUser);

		res.render('users/show.ejs', {
			user: foundUser
		})

	} catch (err){
		res.send(err)
	}
})

//serve image route
router.get('/:id/photo', (req,res, next) => {
	Experience.findById(req.params.id, (err, foundExperience) => {
		if (err){
			next(err);
		} else {
			res.set('Content-Type', foundExperience.img.contentType)
			res.send(foundExperience.img.data)
		}
	})
	
})





module.exports = router;