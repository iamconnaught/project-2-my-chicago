const mongoose = require('mongoose');
const Experience = require('./experiences')

const userSchema = mongoose.Schema({
	username: String,
	password: String,
	experience: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Experience'
	}]
})

const User = mongoose.model('User', userSchema);



module.exports = User;