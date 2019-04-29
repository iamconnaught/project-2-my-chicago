const mongoose = require('mongoose');

const expSchema = mongoose.Schema({
	ownerId: String,
	title: String,
	img: {
		data: Buffer,
		contentType: String
	},
	body: String,
	date: {
		type: Date,
		default: Date.now
	},
});

const Experience = mongoose.model('Experience', expSchema)

module.exports = Experience;