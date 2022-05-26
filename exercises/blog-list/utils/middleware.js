const jwt = require('jsonwebtoken');

const logger = require('./logger');

const errorHandler = (error, request, response, next) => {
	logger.error(error.message);

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');
	request.token = '';

	if (authorization && authorization.toLowerCase().startsWith('bearer')) {
		request.token = authorization.substring(7);
	}

	next();
};

const userExtractor = (request, response, next) => {
	const token = request.token;
	request.user = null;

	if (token) {
		const decodedToken = jwt.verify(token, process.env.SECRET);

		request.user = {
			username: decodedToken.username,
			id: decodedToken.id
		};
	}

	next();
};

module.exports = {
	errorHandler,
	tokenExtractor,
	userExtractor
};
