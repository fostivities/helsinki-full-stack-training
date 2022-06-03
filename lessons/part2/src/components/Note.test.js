import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Note from './Note';

describe('react testing', () => {
	const note = {
		content: 'Component testing is done with react-testing-library',
		important: true
	};

	test('renders content', () => {

		render(<Note note={note} />);

		// screen.debug();

		// getByText looks for elements with exaxt text.
		// For finding an element that contains text: .getByText('text', { exact: false });
		// or: await screen.findByText('text');
		// or (does not return an exception if not found): await screen.queryByText('text')
		// useful for making sure an element is not rendered to a component
		const element = screen.getByText('Component testing is done with react-testing-library');

		// screen.debug(element);

		expect(element).toBeDefined();

		// const { container } = render(<Note note={note} />);

		// const div = container.querySelector('.note');
		// expect(div).toHaveTextContent(
		// 	note.content
		// );
	});

	test('clicking the button calls event handler once', async () => {
		const mockHandler = jest.fn();

		render(
			<Note note={note} toggleImportance={mockHandler} />
		);

		const user = userEvent.setup();
		const button = screen.getByText('make not important');
		await user.click(button);

		expect(mockHandler.mock.calls).toHaveLength(1);
	});
});

