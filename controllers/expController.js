const express = require('express');
const router = express.Router();
const Experience = require('../models/experiences')
const User = require('../models/users')
const multer = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/'})


//NEW
router.get('/new', (req, res)=> {
	res.render('experiences/new.ejs');
});

//CREATE IMAGE UPLOAD 
router.post('/', upload.single('img'), async(req, res, next)=>{
	console.log("uploading....===============");
	try {
		const filePath = './' + req.file.path
		const thisExp = new Experience(req.body)
		// thisExp.title = req.body.title
		console.log(thisExp + "============");
		thisExp.img.data = fs.readFileSync(filePath)
		thisExp.img.contentType = req.file.mimetype
		await thisExp.save();
		const foundUser = await User.findById(req.session.userDbId)
		foundUser.experience.push(thisExp);
		await foundUser.save();
		console.log(foundUser + "=========");


		/// user.push this exp

		// user.save

		res.send('upload done')
	} catch(err){
		next(err);
	}

});


//INDEX
router.get('/', async(req,res,next)=>{
	try {
		const foundExperiences =  await Experience.find({});
	res.render('experiences/index.ejs',{
		experiences: foundExperiences
		})
	} catch(err){
		next(err);
	}
	
});

//SHOW
router.get('/:id', async(req, res, next)=>{
	try {
		// const foundUser = await User.findOne({'experience': req.params.id})
		// 	.populate({path: 'experience', match: {_id: req.params.id}})
		// 	.exec(res.render('experiences/show.ejs', {
		// 		user: foundUser,
		// 		experience: foundUser.experiences[0]
		// 	}))


		const foundUser = await User.findOne({'experiences._id': req.params.id})
			.populate({path: 'experience', match: {_id: req.params.id}})

		console.log(foundUser);
		res.send('check terminal')
			// res.render('experiences/show.ejs', {
			// 	user: foundUser,
			// 	experience: foundUser.experiences[0]
			// })
			
		// const foundExperience = await Experience.findById(req.params.id)
		// res.render('experiences/show.ejs', {
		// 	experience: foundExperience
		// 	})
	} catch(err){
		next(err);
	}
});


//EDIT



//UPDATE


//DELETE




module.exports = router;