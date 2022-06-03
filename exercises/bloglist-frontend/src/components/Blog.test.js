import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Blog from './Blog';

describe('<Blog />', () => {
	const blog = {
		title: 'blog title',
		author: 'blog author',
		url: 'www.google.com',
		likes: 11
	};
	let mockUpdateHandler = jest.fn();
	let container;
	let blogHeader;

	beforeEach(() => {
		container = render(<Blog blog={blog} updateBlog={mockUpdateHandler} />).container;
		blogHeader = container.querySelector('.blog');
	});

	test('should render title and author but not url or likes by default', () => {
		expect(blogHeader).toHaveTextContent(`${blog.title} ${blog.author}`);
		expect(blogHeader).not.toHaveTextContent(blog.url);
		expect(blogHeader).not.toHaveTextContent(blog.likes);
	});

	describe('on button clicks', () => {
		let user;
		let viewButton;

		beforeEach(() => {
			user = userEvent.setup();
			viewButton = container.querySelector('.view-button');
		});

		test('url and likes are shown on view button click', async () => {
			await user.click(viewButton);

			expect(blogHeader).toHaveTextContent(blog.url);
			expect(blogHeader).toHaveTextContent(blog.likes);
		});

		test('when like button is clicked twice, event handler is called twice', async () => {
			await user.click(viewButton);

			const likeButton = container.querySelector('.like-button');

			await user.click(likeButton);
			await user.click(likeButton);

			expect(mockUpdateHandler.mock.calls).toHaveLength(2);
		});
	});

});