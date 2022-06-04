import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationStyle, setNotificationStyle] = useState('success');

	const blogFormRef = useRef();

	useEffect(() => {
		getBlogs();
	}, []);

	useEffect(() => {
		const loggedBlogAppUser = window.localStorage.getItem('loggedBlogAppUser')

		if (loggedBlogAppUser) {
			const user = JSON.parse(loggedBlogAppUser);

			setUser(user);
			blogService.setToken(user.token);
			displayNotification(`welcome ${user.name}`, 'success');
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const loggedInUser = await loginService.login({ username, password });

			window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedInUser));
			blogService.setToken(loggedInUser.token);

			setUser(loggedInUser);
			setUsername('');
			setPassword('');
			displayNotification(`welcome ${loggedInUser.name}`, 'success');
		} catch (err) {
			displayNotification('wrong username or password', 'error');
		}
	}

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogAppUser');
		setUser(null);
		displayNotification('successfully logged out', 'success');
	}

	const getBlogs = async () => {
		try {
			let blogsRetrieved = await blogService.getAll();

			blogsRetrieved = blogsRetrieved.sort((blogA, blogB) => blogB.likes - blogA.likes);

			setBlogs(blogsRetrieved);
		} catch (err) {
			displayNotification('unable to get blogs', 'error');
		}
	}

	const createBlog = async (newBlog) => {
		blogFormRef.current.toggleVisibility();

		try {
			const createdBlog = await blogService.createBlog(newBlog);

			setBlogs(blogs.concat(createdBlog));
			displayNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success');
		} catch (err) {
			displayNotification('unauthorized', 'error');
		}
	}

	const updateBlog = async (blogToUpdate) => {
		try {
			const updatedBlog = await blogService.updateBlog(blogToUpdate);

			setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog));
		} catch (err) {
			displayNotification('unable to update blog', 'error');
		}
	}

	const deleteBlog = async (blogIdToDelete) => {
		try {
			await blogService.deleteBlog(blogIdToDelete);

			setBlogs(blogs.filter(blog => blog.id !== blogIdToDelete));
		} catch (err) {
			displayNotification('unable to delete blog', 'error');
		}
	}

	const displayNotification = (message, style) => {
		setNotificationStyle(style);
		setNotificationMessage(message);

		setTimeout(() => {
			setNotificationMessage('');
			setNotificationStyle('success');
		}, 3000);
	}

	const loginForm = () => (
		<div>
			<h2>log in to application</h2>
			<Notification message={notificationMessage} style={notificationStyle} />

			<form onSubmit={handleLogin}>
				<div>
					username
					<input id="username-input" type="text" name="Username" value={username} onChange={({ target }) => setUsername(target.value)} />
				</div>
				<div>
					password
					<input id="password-input" type="password" name="Password" value={password} onChange={({ target }) => setPassword(target.value)} />
				</div>
				<button id="login-button" type="submit">Submit</button>
			</form>
		</div >
	);

	const blogList = () => (
		<div>
			<h2>blogs</h2>
			<Notification message={notificationMessage} style={notificationStyle} />
			<p>
				{user.name} logged in
				<button onClick={handleLogout}>logout</button>
			</p>

			<Togglable buttonLabel="new blog" ref={blogFormRef}>
				<BlogForm createBlog={createBlog} />
			</Togglable>

			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} username={user.username} updateBlog={updateBlog} deleteBlog={deleteBlog} />
			)}
		</div>
	);

	return (
		<div>
			{!user && loginForm()}
			{user && blogList()}
		</div>
	);
}

export default App;
