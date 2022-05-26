const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialUser = {
	username: 'testuser',
	password: 'testpassword',
	name: 'Test User'
};

const getUser = async () => {
	const passwordHash = await bcrypt.hash(initialUser.password, 10);

	const user = new User({
		username: initialUser.username,
		passwordHash,
		name: initialUser.name
	});

	return user;
};

const initialBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});

	return blogs.map(blog => blog.toJSON());
};

module.exports = {
	initialUser,
	getUser,
	initialBlogs,
	blogsInDb
};