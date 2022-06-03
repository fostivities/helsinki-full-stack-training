describe('Note app', () => {
	const user = {
		name: 'Cypress Test',
		username: 'cypresstest',
		password: 'testpassword',
	};

	beforeEach(() => {
		cy.request('POST', 'http://localhost:3001/api/testing/reset');
		cy.request('POST', 'http://localhost:3001/api/users/', user);

		cy.visit('http://localhost:3000');

	});

	it('front page can be opened', () => {
		cy.contains('Notes');
		cy.contains('Note app, Department of Computer Science, University of Helsinki 2022');
	});

	it('login fails with wrong password', () => {
		cy.contains('login').click();
		cy.get('#username').type(user.username);
		cy.get('#password').type('wrongpassword');
		cy.get('#login-button').click();

		cy
			.get('.error')
			.should('contain', 'Wrong credentials')
			.and('have.css', 'color', 'rgb(255, 0, 0)')
			.and('have.css', 'border-style', 'solid');

		cy.get('html').should('not.contain', `${user.name} logged in`);
	});

	it('logs in successfully', () => {
		cy.contains('login').click();
		cy.get('#username').type(user.username);
		cy.get('#password').type(user.password);
		cy.get('#login-button').click();

		cy.contains(`${user.name} logged in`);
	});

	describe('when logged in', () => {
		beforeEach(() => {
			cy.login({ username: user.username, password: user.password });
		});

		it('a new note can be created', () => {
			cy.contains('new note').click();
			cy.get('#note-input').type('a note created by cypress');
			cy.contains('save').click();
			cy.contains('a note created by cypress');
		});

		describe('and a note exists', () => {
			beforeEach(() => {
				cy.createNote({ content: 'first note', important: false });
				cy.createNote({ content: 'second note', important: false });
				cy.createNote({ content: 'third note', important: false });
			});

			it.only('it can be made important', () => {
				// cy
				// 	.contains('second note')
				// 	.contains('make important')
				// 	.click();

				// cy
				// 	.contains('second note')
				// 	.contains('make not important');

				cy.contains('second note').parent().find('button').as('theButton');
				cy.get('@theButton').click();
				cy.get('@theButton').should('contain', 'make not important');
			})
		});
	});

});