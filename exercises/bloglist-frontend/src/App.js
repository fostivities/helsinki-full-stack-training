import { useState, useEffect } from 'react';

import Blog from './components/Blog';
import Notification from './components/Notification';

import blogService from './services/blogs';
import loginService from './services/login';

function App() {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');
	const [notificationMessage, setNotificationMessage] = useState('');
	const [notificationStyle, setNotificationStyle] = useState('success');

	useEffect(() => {
		blogService.getAll().then(blogs =>
			setBlogs(blogs)
		);
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

	const handleLogout = (event) => {
		window.localStorage.removeItem('loggedBlogAppUser');
		setUser(null);
		displayNotification('successfully logged out', 'success');
	}

	const handleCreateBlog = async (event) => {
		event.preventDefault();

		try {
			const newBlog = {
				title,
				author,
				url
			};
			const createdBlog = await blogService.createBlog(newBlog);

			setBlogs(blogs.concat(createdBlog));
			setTitle('');
			setAuthor('');
			setUrl('');
			displayNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success');
		} catch (err) {
			displayNotification('unauthorized', 'error');
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
					<input type="text" name="Username" value={username} onChange={({ target }) => setUsername(target.value)} />
				</div>
				<div>
					password
					<input type="password" name="Password" value={password} onChange={({ target }) => setPassword(target.value)} />
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	)

	const blogList = () => (
		<div>
			<h2>blogs</h2>
			<Notification message={notificationMessage} style={notificationStyle} />
			<p>
				{user.name} logged in
				<button onClick={handleLogout}>logout</button>
			</p>

			{blogForm()}

			{blogs.map(blog =>
				<Blog key={blog.id} blog={blog} />
			)}
		</div>
	)

	const blogForm = () => (
		<div>
			<h2>create new</h2>
			<form onSubmit={handleCreateBlog}>
				<div>
					title:
					<input type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)} />
				</div>
				<div>
					author:
					<input type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)} />
				</div>
				<div>
					url:
					<input type="text" value={url} name="Url" onChange={({ target }) => setUrl(target.value)} />
				</div>
				<button type="submit">Submit</button>
			</form>
		</div>
	)

	return (
		<div>
			{!user && loginForm()}
			{user && blogList()}
		</div>
	);
}

export default App;
