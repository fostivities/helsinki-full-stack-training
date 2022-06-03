import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NoteForm from './NoteForm';

describe.only('<NoteForm />', () => {

	test('updates parent state and calls onSubmit', async () => {
		const createNote = jest.fn();
		const user = userEvent.setup();

		// const { container } = render(<NoteForm createNote={createNote} />);
		// const input = container.querySelector('#note-input');

		render(<NoteForm createNote={createNote} />);

		// const input = screen.getByRole('textbox');
		const input = screen.getByPlaceholderText('write note content here');

		// for multiple inputs on screen can use:
		// const inputs = screen.getAllByRole('textbox');
		// await user.type(inputs[0], 'testing a form...');

		const sendButton = screen.getByText('save', { exact: false });

		await user.type(input, 'testing a form...');
		await user.click(sendButton);

		expect(createNote.mock.calls).toHaveLength(1);
		expect(createNote.mock.calls[0][0].content).toBe('testing a form...');
	});
});
