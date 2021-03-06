/************************************************
				EXPERIENCE MODEL
************************************************/

const mongoose = require('mongoose');
const user = require('./users')

const expSchema = new mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
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
	lat: Number,
	lng: Number
});

const Experience = mongoose.model('Experience', expSchema)

module.exports = Experience;