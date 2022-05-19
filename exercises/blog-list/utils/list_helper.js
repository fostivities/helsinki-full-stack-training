const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => {
		return sum + blog.likes;
	};

	return blogs.length
		? blogs.reduce(reducer, 0)
		: 0;
};

const favoriteBlog = (blogs) => {
	const reducer = (prev, current) => current.likes > prev.likes ? current : prev;
	const blogWithMostLikes = (blogs && blogs.length) ? blogs.reduce(reducer) : null;

	return blogWithMostLikes;
};

const mostBlogs = (blogs) => {
	const authorBlogList = [];
	const reducer = (prev, current) => current.blogs > prev.blogs ? current : prev;

	blogs.forEach(blog => {
		const authorFromBlogList = authorBlogList.find(authorBlog => authorBlog.author === blog.author);

		if (authorFromBlogList) {
			authorFromBlogList.blogs++;
		} else {
			authorBlogList.push({
				author: blog.author,
				blogs: 1
			});
		}
	});

	return authorBlogList.length
		? authorBlogList.reduce(reducer)
		: null;
};

const mostLikes = (blogs) => {
	const authorLikeList = [];
	const reducer = (prev, current) => current.likes > prev.likes ? current : prev;

	blogs.forEach(blog => {
		const authorFromLikeList = authorLikeList.find(authorLike => authorLike.author === blog.author);

		if (authorFromLikeList) {
			authorFromLikeList.likes = authorFromLikeList.likes + blog.likes;
		} else {
			authorLikeList.push({
				author: blog.author,
				likes: blog.likes
			});
		}
	});

	return authorLikeList.length
		? authorLikeList.reduce(reducer)
		: null;
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
};