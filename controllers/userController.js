/************************************************
				USER CONTROLLER
************************************************/

const express = require('express');
const router = express.Router();
const User = require('../models/users')
const Experience = require('../models/experiences')


//USER INDEX PAGE ROUTE

router.get('/', async (req,res) => {

	try {
		if(!req.session.logged){
			res.redirect('/auth/login')
		}	

		const foundUsers = await User.find({}); 

		res.render('users/index.ejs', {
			users:foundUsers,
			userProfile: req.session.userDbId
		})

	} catch (err){
		res.send(err)
	}
})


//USER SHOW PAGE ROUTE

router.get('/:id', async (req,res) => {
	try {
		if(!req.session.logged){
			res.redirect('/auth/login')
		}
		const foundUser = await User.findById(req.params.id).populate('experience')

		res.render('users/show.ejs', {
			user: foundUser,
			userProfile: req.session.userDbId

	} catch (err){
		res.send(err)
	}
})


//USER CONTROLLER SERVE IMAGE ROUTE

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