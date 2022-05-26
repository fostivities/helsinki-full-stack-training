const bcrypt = require('bcrypt');

const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
	const users = await User
		.find({})
		.populate('blogs', { url: 1, title: 1, author: 1 });

	response.json(users);
})

userRouter.post('/', async (request, response) => {
	const { username, password, name } = request.body;

	if (!password || password.length < 3) {
		return response.status(400).json({ error: 'missing or invalid password' });
	}
	
	const existingUser = await User.findOne({ username });

	if (existingUser) {
		return response.status(400).json({ error: 'username must be unique' });
	}

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({
		username,
		name,
		passwordHash
	});

	await user.save();

	response.status(201).json(user);
});

module.exports = userRouter;