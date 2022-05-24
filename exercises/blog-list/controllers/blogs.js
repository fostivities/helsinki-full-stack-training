const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});

	response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
	blog = new Blog({
		title: request.body.title,
		author: request.body.author,
		url: request.body.url,
		likes: 0
	});

	const newBlog = await blog.save();

	response.status(201).json(newBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const { title, author, url, likes } = request.body;
	const updateQuery = { title, author, url, likes };
	const queryOptions = { new: true, runValidators: true, context: 'query' };

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updateQuery, queryOptions);

	response.json(updatedBlog);
});

module.exports = blogsRouter;