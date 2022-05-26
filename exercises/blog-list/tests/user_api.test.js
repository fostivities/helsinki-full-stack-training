const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await User.deleteMany();

	const user = helper.getUser();

	await user.save();
});

describe('invalid users are not added', () => {
	test('due to missing username or password', async () => {
		const newUser = { name: 'test user' };

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('missing or invalid password');
	});

	test('due to too short username or password', async () => {
		const newUser = {
			username: 'te',
			password: 'testpassword',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('User validation failed');
	});

	test('due to username not being unique', async (request, response) => {
		const newUser = {
			username: 'testuser',
			password: 'testpassword'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('username must be unique');
	})
});

afterAll(() => {
	mongoose.connection.close();
});