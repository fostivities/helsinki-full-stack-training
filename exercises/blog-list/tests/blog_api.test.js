const mongoose = require('mongoose');
const supertest = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany({});

	const passwordHash = await bcrypt.hash(helper.initialUser.password, 10);

	const user = new User({
		username: helper.initialUser.username,
		passwordHash,
		name: helper.initialUser.name
	});

	await user.save();

	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

describe('unauthorized calls', () => {
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

	test('blog is updated by id', async () => {
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
});

describe('authorized calls', () => {
	const newBlog = {
		title: 'Test Title',
		author: 'Test Author',
		url: 'www.testurl.com'
	};

	let token = null;

	beforeEach(async () => {
		const result = await api
			.post('/api/login')
			.send(helper.initialUser);

		token = result.body;
	});

	test('a new blog can be added', async () => {

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await helper.blogsInDb();

		expect(blogs).toHaveLength(helper.initialBlogs.length + 1);
	});

	test('a new blog is not added when unauthorized', async () => {

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);

		const blogs = await helper.blogsInDb();

		expect(blogs).toHaveLength(helper.initialBlogs.length);
	});

	test('likes is missing when blog is added, defaulted to zero', async () => {

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogs = await helper.blogsInDb();
		const recentlyAddedBlog = blogs.find(b => b.title === newBlog.title);

		expect(recentlyAddedBlog.likes).toEqual(0);
	});

	test('blog without title or url is not added', async () => {
		const blogWithoutTitle = {
			author: 'Test Author'
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token.token}`)
			.send(blogWithoutTitle)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDb();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test('blog is deleted by id', async () => {

		const result = await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token.token}`)
			.send(newBlog)
			.expect(201);

		await api
			.delete(`/api/blogs/${result.body.id}`)
			.set('Authorization', `Bearer ${token.token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDb();
		const titlesAtEnd = blogsAtEnd.map(blog => blog.content);

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
		expect(titlesAtEnd).not.toContain(newBlog.title);
	});
});

afterAll(async () => {
	mongoose.connection.close();
});