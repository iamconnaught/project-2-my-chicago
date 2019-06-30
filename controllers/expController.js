/************************************************
				EXPERIENCES CONTROLLER
************************************************/

const express = require('express');
const router = express.Router();
const Experience = require('../models/experiences');
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp')
const upload = multer({ dest: 'uploads/'})


//NEW EXPERIENCE FORM PAGE

router.get('/new', (req, res)=> {

	if (!req.session.logged) {
			res.redirect('/auth/login');
		}

	res.render('experiences/new.ejs', {
		userProfile: req.session.userDbId,
		apiKey: process.env.API_KEY
	})

});


// GOOGLE MAP ROUTE

router.get('/map', async (req,res, next) => {

	try {
		res.render('experiences/map.ejs', {
			userProfile: req.session.userDbId, //variable to inject on navigation to profile.
			apiKey: process.env.API_KEY
		})
		
	} catch (err){
		res.send(err)
	}
});


//CREATE EXPERIENCE WITH IMAGE UPLOAD 

router.post('/', upload.single('img'), async(req, res, next)=>{
	
	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}

		const filePath = './' + req.file.path
		const thisExp = new Experience(req.body)
		thisExp.ownerId = req.session.userDbId
		thisExp.title = req.body.title
		thisExp.body = req.body.body
		thisExp.date = req.body.date
		thisExp.img.data = fs.readFileSync(filePath)
		await thisExp.save();

		const foundUser = await User.findById(req.session.userDbId)
		foundUser.experience.push(thisExp);
		await foundUser.save();

		await fs.unlink(filePath, (err) => {
			if(err) next(err);
		})
		
		res.redirect('/experiences')

	} catch(err){
		next(err);
	}

});


// EXPERIENCES CONTROLLER SERVE IMAGE ROUTE

router.get('/:id/photo', async (req,res, next) => {

	try {
		const foundExperience = await Experience.findById(req.params.id);
		res.set('Content-Type', foundExperience.img.contentType)
		const image = await sharp(foundExperience.img.data).rotate().toBuffer();
		res.send(image);

	} catch (err) {

		next(err)

	}
	
})


//EXPERIENCES INDEX PAGE ROUTE

router.get('/', async(req,res,next)=>{
	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}
		const foundUsers = await User.find({});
		const foundExperiences =  await Experience.find({});
	res.render('experiences/index.ejs',{
		experiences: foundExperiences,
		userProfile: req.session.userDbId//variable to inject on navigation to profile.
		})
	} catch(err){
		next(err);
	}
	
});


//EXPERIENCES SHOW PAGE ROUTE

router.get('/:id', async(req, res, next)=>{

	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}

		const foundUser = await Experience.findById(req.params.id).populate('ownerId')
		const exp = await Experience.findById(req.params.id)
		res.render('experiences/show.ejs',{
			user: foundUser,
			experience: exp,
			apiKey: process.env.API_KEY,
			userProfile: req.session.userDbId
		})

	} catch(err){
		next(err);
	}
});


//EXPERIENCES EDIT PAGE ROUTE

router.get('/:id/edit', async (req,res, next) => {

	try {
		if(!req.session.logged) {
			res.redirect('/auth/login');
		}

		const foundExperience = await Experience.findById(req.params.id, req.body, {new: true})
		res.render('experiences/edit.ejs', {
			experience: foundExperience,
			userProfile: req.session.userDbId,
		})

	} catch (err){
		next(err)
	}
})


//EXPERIENCES UPDATE ROUTE

router.put('/:id', async (req,res, next) => {

	try {
		const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.redirect('/experiences/' + req.params.id)

	} catch (err){
		next(err)
	}
})


//EXPERIENCES DELETE ROUTE

router.delete('/:id', async (req,res, next) => {

	try {
		const deletedExperience = await Experience.findByIdAndRemove(req.params.id)
		res.redirect('/experiences')

	} catch (err){
		next(err)
	}
})



module.exports = router;