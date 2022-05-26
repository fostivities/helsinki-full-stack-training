const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({})
		.populate('user', { username: 1, name: 1 });

	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	const authUser = request.user;

	// console.log(authUser);

	if (!authUser || !authUser.id) {
		return response.status(401).json({ error: 'token missing or invalid' });
	}

	const user = await User.findOne({});

	const blog = new Blog({
		title: request.body.title,
		author: request.body.author,
		url: request.body.url,
		likes: 0,
		user: user.id
	});

	const newBlog = await blog.save();

	user.blogs = user.blogs.concat(newBlog);
	await user.save();

	response.status(201).json(newBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	const authUser = request.user;

	if (authUser && authUser.id) {
		const blog = await Blog.findById(request.params.id);

		if (blog.user && blog.user.toString() === authUser.id.toString()) {
			await Blog.findByIdAndRemove(request.params.id);
			response.status(204).end();
		}
	}

	return response.status(401).json({ error: 'invalid token or user' });
});

blogsRouter.put('/:id', async (request, response) => {
	const { title, author, url, likes } = request.body;
	const updateQuery = { title, author, url, likes };
	const queryOptions = { new: true, runValidators: true, context: 'query' };

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateQuery, queryOptions);

	response.json(updatedBlog);
});

module.exports = blogsRouter;