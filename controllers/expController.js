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
	// console.log("uploading....===============");
	try {
		const filePath = './' + req.file.path
		const thisExp = new Experience(req.body)
		thisExp.title = req.body.title
		thisExp.body = req.body.body
		console.log(thisExp.body + "<==============");
		thisExp.date = req.body.date
		  console.log(thisExp + "============");
		thisExp.img.data = fs.readFileSync(filePath)
		
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


// SERVE IMAGE ROUTE
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


//SHOW
router.get('/:id', async(req, res, next)=>{
	try {
		const foundUser = await User.findById(req.session.userDbId)
			.populate({path: 'experience', match: {_id: req.params.id}})
		console.log(foundUser);
		// res.contentType(experience.img.contentType)
		res.render('experiences/show.ejs',{
			user: foundUser,
			//message: 'you did it',
			experience: foundUser.experience[0]
		})
	} catch(err){
		next(err);
	}
});


//EDIT



//UPDATE


//DELETE




module.exports = router;