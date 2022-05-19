const listHelper = require('../utils/list_helper');

const blogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 3,
		__v: 0
	}
];

test('dummy returns one', () => {
	const blogs = [];
	const result = listHelper.dummy(blogs);

	expect(result).toBe(1);
});


describe('total likes', () => {

	test('of empty list is zero', () => {
		expect(listHelper.totalLikes([])).toBe(0);
	});

	test('when list has only one blog equals the likes of that', () => {
		const listWithOneBlog = [blogs[0]];
		const result = listHelper.totalLikes(listWithOneBlog);

		expect(result).toBe(7);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(blogs);

		expect(result).toBe(37);
	});
});

describe('favorite blog', () => {

	test('of empty list is null', () => {
		expect(listHelper.favoriteBlog([])).toEqual(null);
	});

	test('when list has only one blog equals the likes of that', () => {
		const listWithOneBlog = [blogs[0]];
		const result = listHelper.favoriteBlog(listWithOneBlog);

		expect(result).toEqual(blogs[0]);
	});

	test('of a bigger list is calculated right', () => {
		const expectedBlog = {
			_id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
			__v: 0
		};
		const result = listHelper.favoriteBlog(blogs);

		expect(result).toEqual(expectedBlog);
	});
});

describe('most blogs', () => {
	
	test('of empty list is null', () => {
		expect(listHelper.mostBlogs([])).toEqual(null);
	});

	test('when list has only one blog equals the likes of that', () => {
		const expectedResult = {
			author: blogs[0].author,
			blogs: 1
		};
		const listWithOneBlog = [blogs[0]];
		const result = listHelper.mostBlogs(listWithOneBlog);

		expect(result).toEqual(expectedResult);
	});

	test('of a bigger list is calculated right', () => {
		const expectedResult = {
			author: 'Robert C. Martin',
			blogs: 3
		};
		const result = listHelper.mostBlogs(blogs);

		expect(result).toEqual(expectedResult);
	});
});

describe('most likes', () => {
	
	test('of empty list is null', () => {
		expect(listHelper.mostLikes([])).toEqual(null);
	});

	test('when list has only one blog equals the likes of that', () => {
		const expectedResult = {
			author: blogs[0].author,
			likes: blogs[0].likes
		};
		const listWithOneBlog = [blogs[0]];
		const result = listHelper.mostLikes(listWithOneBlog);

		expect(result).toEqual(expectedResult);
	});

	test('of a bigger list is calculated right', () => {
		const expectedResult = {
			author: 'Edsger W. Dijkstra',
			likes: 17
		};
		const result = listHelper.mostLikes(blogs);

		expect(result).toEqual(expectedResult);
	});
});
