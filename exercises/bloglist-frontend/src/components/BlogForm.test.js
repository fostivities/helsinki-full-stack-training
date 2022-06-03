import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import BlogForm from './BlogForm';

describe('<BlogForm />', () => {
	test.only('should call createBlog with correct properites on save button click', async () => {
		const mockCreateBlog = jest.fn();
		const user = userEvent.setup();
		const newBlog = {
			title: 'new title',
			author: 'new author',
			url: 'www.google.com'
		};


		const { container } = render(<BlogForm createBlog={mockCreateBlog} />);
		const saveButton = container.querySelector('#save-button');

		const titleInput = container.querySelector('#title-input');
		const authorInput = container.querySelector('#author-input');
		const urlInput = container.querySelector('#url-input');

		await user.type(titleInput, newBlog.title);
		await user.type(authorInput, newBlog.author);
		await user.type(urlInput, newBlog.url);
		await user.click(saveButton);

		expect(mockCreateBlog.mock.calls[0][0].title).toBe(newBlog.title);
		expect(mockCreateBlog.mock.calls[0][0].author).toBe(newBlog.author);
		expect(mockCreateBlog.mock.calls[0][0].url).toBe(newBlog.url);
	});
});
