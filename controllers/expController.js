const express = require('express');
const router = express.Router();
const Experience = require('../models/experiences');
const User = require('../models/users');
const multer = require('multer');
const fs = require('fs');
// const fixOrientation = require('fix-orientation');
// const jimp = require('jimp')
const sharp = require('sharp')
const upload = multer({ dest: 'uploads/'})


//auth requirement
// router.use((req,res,next)=>{
// 	try {
// 		if(!req.session.logged){
// 			res.redirect('/auth/login');
// 		}
// 	} catch(err){
// 		next(err);
// 	}
// })


//NEW
router.get('/new', (req, res)=> {
	if(!req.session.logged){
			res.redirect('/auth/login');
		}
	res.render('experiences/new.ejs', {
		userProfile: req.session.userDbId,//variable to inject on navigation to profile.
		apiKey: process.env.API_KEY
	});
});

// MAP ROUTE

router.get('/map', async (req,res, next) => {
	try {
		res.render('experiences/map.ejs', {
			userProfile: req.session.userDbId, //variable to inject on navigation to profile.
			apiKey: process.env.API_KEY
		})
		
	} catch (err){
		res.send(err)
	}
})

//CREATE IMAGE UPLOAD 
router.post('/', upload.single('img'), async(req, res, next)=>{
	// console.log("uploading....===============");
	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}
		const filePath = './' + req.file.path
		const thisExp = new Experience(req.body)
		thisExp.ownerId = req.session.userDbId
		console.log('thisExp.ownerId');
		console.log(thisExp.ownerId);
		thisExp.title = req.body.title
		thisExp.body = req.body.body
		// console.log(thisExp.body + "<==============");
		thisExp.date = req.body.date
		  // console.log(thisExp + "============");
		thisExp.img.data = fs.readFileSync(filePath)
		// thisExp.lat = navigator.geolocation.getCurrentPosition((lat) => {
		// 	console.log(thisExp.lat);
		// })
		// thisExp.lng = navigator.geolocation.getCurrentPosition((lng) => {
		// 	console.log(thisExp.lng);
		// })
		
		await thisExp.save();
		const foundUser = await User.findById(req.session.userDbId)
		foundUser.experience.push(thisExp);
		await foundUser.save();
		await fs.unlink(filePath, (err) => {
			if(err) next(err);
		})
		// console.log(foundUser + "=========");
		res.redirect('/experiences')
	} catch(err){
		next(err);
	}

});

// SERVE IMAGE ROUTE
router.get('/:id/photo', async (req,res, next) => {
	try {
		const foundExperience = await Experience.findById(req.params.id);
		// console.log("\nfoundExperience.img");
		// console.log(foundExperience.img);
		// console.log("\nimage");
		// console.log(foundExperience.img.data);
		// res.set('Content-Type', foundExperience.img.contentType)
		// res.send(foundExperience.img.data)
		res.set('Content-Type', foundExperience.img.contentType)
		const image = await sharp(foundExperience.img.data).rotate().toBuffer();
		res.send(image);
	} catch (err) {
		next(err)
	}
	// Experience.findById(req.params.id, (err, foundExperience) => {
	// 	if (err){
	// 		next(err);
	// 	} else {
	// 		res.set('Content-Type', foundExperience.img.contentType)
	// 		const image = await jimp.read(foundExperience.img.data)
	// 		image.rotate(90);
	// 		res.send(image)
	// 	}
	// })
	
})

//INDEX
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


//SHOW

router.get('/:id', async(req, res, next)=>{
	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}
		// const foundUser = await User.findById(req.session.userDbId)
		// 	.populate({path: 'experience', match: {_id: req.params.id}})
		// console.log(foundUser);
		const foundUser = await Experience.findById(req.params.id).populate('ownerId')
		// console.log("\ndid it actually work?");
		console.log('foundUser');
		console.log(foundUser);
		const exp = await Experience.findById(req.params.id)
		// res.contentType(experience.img.contentType)
		res.render('experiences/show.ejs',{
			user: foundUser,
			//message: 'you did it',
			// experience: foundUser.experience[0]
			experience: exp,
			apiKey: process.env.API_KEY,
			userProfile: req.session.userDbId//variable to inject on navigation to profile.
		})
	} catch(err){
		next(err);
	}
});


//EDIT
router.get('/:id/edit', async (req,res, next) => {
	try {
		if(!req.session.logged){
			res.redirect('/auth/login');
		}
		const foundExperience = await Experience.findById(req.params.id, req.body, {new: true})
		res.render('experiences/edit.ejs', {
			experience: foundExperience,
			userProfile: req.session.userDbId,
			//variable to inject on navigation to profile.
		})


	} catch (err){
		next(err)
	}
})


// UPDATE
router.put('/:id', async (req,res, next) => {
	try {
		const updatedExperience = await Experience.findByIdAndUpdate(req.params.id, req.body, {new: true})
		res.redirect('/experiences/' + req.params.id)
	} catch (err){
		next(err)
	}
})


//DELETE
router.delete('/:id', async (req,res, next) => {
	try {
		const deletedExperience = await Experience.findByIdAndRemove(req.params.id)
		res.redirect('/experiences')
	} catch (err){
		next(err)
	}
})



module.exports = router;