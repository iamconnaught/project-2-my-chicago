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
		currentUser: req.session.username,
		apiKey: process.env.API_KEY,
		createMessage: req.session.createMessage
	})

});


// GOOGLE MAP ROUTE

router.get('/map', async (req,res, next) => {

	try {
		res.render('experiences/map.ejs', {
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

		const thisExp = new Experience(req.body)
		thisExp.owner = req.session.userDbId
		thisExp.title = req.body.title
		thisExp.body = req.body.body
		thisExp.date = req.body.date

		if(thisExp.title === "" || thisExp.body === "" || !req.file){
			req.session.createMessage = "Please enter title, body or upload image"
			res.redirect("/experiences/new")
		}

		const filePath = './' + req.file.path
		thisExp.img.data = fs.readFileSync(filePath)
		await fs.unlink(filePath, (err) => {
			if(err) next(err);
		})

		await thisExp.save();

		const foundUser = await User.findById(req.session.userDbId)
		foundUser.experience.push(thisExp);
		await foundUser.save();

		res.redirect(`/users/${req.session.userDbId}`)

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
		userProfile: req.session.userDbId,
		currentUser: req.session.username
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

		const foundUser = await Experience.findById(req.params.id).populate('owner')
		const exp = await Experience.findById(req.params.id)
		res.render('experiences/show.ejs',{
			user: foundUser,
			experience: exp,
			editMessage: req.session.editMessage,
			apiKey: process.env.API_KEY,
			userProfile: req.session.userDbId,
			currentUser: req.session.username
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
		const foundExperience = await Experience.findById(
			req.params.id, req.body, {new: true}
			).populate('owner');
		
		if(req.session.userDbId.toString() !== foundExperience.owner._id.toString()) {
			req.session.editMessage = "Unable to edit or delete post"
			res.redirect(`/experiences/${req.params.id}`)
		} else {

		res.render('experiences/edit.ejs', {
			experience: foundExperience,
			editMessage: req.session.editMessage,
			userProfile: req.session.userDbId,
			currentUser: req.session.username
		})

		}

	} catch (err){
		next(err)
	}
})


//EXPERIENCES UPDATE ROUTE

router.put('/:id', async (req,res,next) => {

	try {
		if(req.body.title === "" || req.body.body === ""){
			req.session.editMessage = "Please enter title or body"
			res.redirect("/experiences/" + req.params.id + "/edit")
		}

		const updatedExperience = await Experience.findByIdAndUpdate(
			req.params.id, req.body, {new: true}
			);

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