import { useState } from 'react';

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
				<button className='like-button' style={buttonStyle} onClick={addLike}>like</button>
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
		<div style={blogStyle} className="blog">
			<div>
				{blog.title} {blog.author}
				{!isDetailVisible && <button className="view-button" style={buttonStyle} onClick={toggleDetailVisibility}>view</button>}
				{isDetailVisible && <button className="hide-button" style={buttonStyle} onClick={toggleDetailVisibility}>hide</button>}
			</div>
			{isDetailVisible && displayDetails()}
		</div>
	)
};

export default Blog;