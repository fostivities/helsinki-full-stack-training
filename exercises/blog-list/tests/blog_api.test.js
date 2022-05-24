const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
	const promises = blogObjects.map(b => b.save());

	await Promise.all(promises);
});

test('all blogs are returned as json', async () => {
	const notes = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	expect(notes.body).toHaveLength(helper.initialBlogs.length);
});

test('blog has property id', async () => {
	const blogs = await helper.blogsInDb();
	const blog = blogs[0];

	expect(blog.id).toBeDefined();
});

test('a new blog can be added', async () => {
	const newBlog = {
		title: 'Test Title',
		author: 'Test Author',
		url: 'www.testurl.com'
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogs = await helper.blogsInDb();

	expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
});

test('likes is missing when blog is added, defaulted to zero', async () => {
	const newBlog = {
		title: 'Test Title',
		author: 'Test Author',
		url: 'www.testurl.com'
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogs = await helper.blogsInDb();
	const recentlyAddedBlog = blogs.find(b => b.title === newBlog.title);

	expect(recentlyAddedBlog.likes).toEqual(0);
});

test('blog without title or url is not added', async () => {
	const newBlog = {
		author: 'Test Author'
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(400);

	const blogsAtEnd = await helper.blogsInDb();

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('blog is deleted by id', async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToDelete = blogsAtStart[0];

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.expect(204);

	const blogsAtEnd = await helper.blogsInDb();
	const titlesAtEnd = blogsAtEnd.map(blog => blog.content);

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
	expect(titlesAtEnd).not.toContain(blogToDelete.title);
});

test.only('blog is updated by id', async () => {
	const blogsAtStart = await helper.blogsInDb();
	const blogToUpdate = { ...blogsAtStart[0], likes: blogsAtStart[0].likes + 1 };

	await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.send(blogToUpdate)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	const blogAtEnd = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);

	expect(blogAtEnd.likes).toEqual(blogToUpdate.likes);
});

afterAll(async () => {
	mongoose.connection.close();
});