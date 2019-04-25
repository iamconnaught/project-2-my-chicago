const express = require('express');
const router = express.Router();
const Experience = require('../models/experiences')
const User = require('../models/users')
// pend multer for pictures
//pend fs as part of multer

//NEW
router.get('/new', (req, res)=> {
	res.render('experiences/new.ejs');
})

//CREATE
router.post('/', async(req,res)=>{
	const createdExperience = await Experience.create(req.body);
	res.redirect('/experiences',{
		experience: createdExperience
	})
})


//INDEX


//SHOW


//EDIT



//UPDATE


//DELETE




module.exports = router;