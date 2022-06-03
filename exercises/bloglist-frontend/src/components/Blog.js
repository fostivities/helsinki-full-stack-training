import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, username, updateBlog, deleteBlog }) => {
	const [isDetailVisible, setIsDetailVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5
	};

	const buttonStyle = {
		marginLeft: 10
	};

	const toggleDetailVisibility = () => setIsDetailVisible(!isDetailVisible);

	const addLike = () => {
		updateBlog({
			...blog,
			likes: blog.likes + 1
		});
	};

	const removeBlog = () => {
		deleteBlog(blog.id);
	};

	const displayDetails = () => (
		<div>
			<div>{blog.url}</div>
			<div>
				likes: {blog.likes}
				<button style={buttonStyle} onClick={addLike}>like</button>
			</div>
			{blog.user && blog.user.name && <div>{blog.user.name}</div>}
			{displayRemoveButton()}
		</div>
	);

	const displayRemoveButton = () => {
		if (blog.user && blog.user.username === username) {
			return (
				<button onClick={removeBlog}>remove</button>
			);
		}
	};

	return (
		<div style={blogStyle}>
			<div>
				{blog.title} {blog.author}
				{!isDetailVisible && <button style={buttonStyle} onClick={toggleDetailVisibility}>view</button>}
				{isDetailVisible && <button style={buttonStyle} onClick={toggleDetailVisibility}>hide</button>}
			</div>
			{isDetailVisible && displayDetails()}
		</div>
	)
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	updateBlog: PropTypes.function.isRequired,
	deleteBlog: PropTypes.function.isRequired
};

export default Blog;