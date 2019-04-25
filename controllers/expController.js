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

//CREATE route
router.post('/', upload.single('img'), async(req, res, next)=>{
	console.log("uploading....===============");
	try {
		const filePath = './' + req.file.path
		const thisExp = new Experience
		thisExp.title = req.body.title
		thisExp.img.data = fs.readFileSync(filePath)
		thisExp.img.contentType = req.file.mimetype
		await thisExp.save();
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
router.get('/:id', async(req, res)=>{
	try {
		const foundExperience = await Experience.findById(req.params.id)
		res.render('experiences/show.ejs', {
			experience: foundExperience
			})
		} catch(err){
			res.send(err);
		}
})


//EDIT



//UPDATE


//DELETE




module.exports = router;