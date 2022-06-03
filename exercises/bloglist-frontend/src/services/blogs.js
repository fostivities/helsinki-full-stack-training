import axios from 'axios';

const baseUrl = '/api/blogs';

let token = null;

const setToken = newToken => {
	token = `bearer ${newToken}`;
};

const getAll = () => {
	const request = axios.get(baseUrl);

	return request.then(response => response.data);
};

const createBlog = (blog) => {
	const config = {
		headers: { Authorization: token }
	};

	const request = axios.post(baseUrl, blog, config);

	return request.then(response => response.data);
};

const updateBlog = (blog) => {
	const request = axios.put(`${baseUrl}/${blog.id}`, blog);

	return request.then(response => response.data);
};

const deleteBlog = (blogId) => {
	const config = {
		headers: { Authorization: token }
	};

	const request = axios.delete(`${baseUrl}/${blogId}`, config);

	return request.then(response => response.data);
}

export default {
	setToken,
	getAll,
	createBlog,
	updateBlog,
	deleteBlog
};
