
describe('Blog app', () => {
	const user = {
		username: 'cypresstest',
		password: 'testpassword',
		name: 'Cypress Test'
	};

	beforeEach(() => {
		cy.request('POST', 'http://localhost:3003/api/testing/reset');
		cy.request('POST', 'http://localhost:3003/api/users', user);

		cy.visit('http://localhost:3000');
	});

	it('Login form is shown', () => {
		cy.contains('log in to application');
	});

	describe('Login', () => {
		it('succeeds with correct credentials', () => {
			cy.get('#username-input').type(user.username);
			cy.get('#password-input').type(user.password);
			cy.get('#login-button').click();

			cy.contains(`${user.name} logged in`);
		});

		it('failes with incorrect credentials', () => {
			cy.get('#username-input').type(user.username);
			cy.get('#password-input').type('wrongpassword');
			cy.get('#login-button').click();

			cy
				.get('.notification')
				.should('contain', 'wrong username or password')
				.and('have.css', 'color', 'rgb(255, 0, 0)')
				.and('have.css', 'border-style', 'solid');
		});
	});

	describe('When logged in', () => {
		const testBlogs = [
			{
				title: 'title1',
				author: 'author1',
				url: 'www.google.com'
			}, {
				title: 'title2',
				author: 'author2',
				url: 'www.google.com'
			}, {
				title: 'title3',
				author: 'author3',
				url: 'www.google.com'
			}
		];
		const primaryBlog = testBlogs[0];
		const primaryBlogTitle = `${primaryBlog.title} ${primaryBlog.author}`;

		beforeEach(() => {
			cy.login({ username: user.username, password: user.password });
		});

		it('A blog can be created', () => {
			cy.contains('new blog').click();

			cy.get('#title-input').type(primaryBlog.title);
			cy.get('#author-input').type(primaryBlog.author);
			cy.get('#url-input').type(primaryBlog.url);

			cy.get('#save-button').click();

			cy.contains(primaryBlogTitle);
		});

		describe('and a blog exists', () => {
			beforeEach(() => {
				cy.createBlog(primaryBlog);

				cy.contains(primaryBlogTitle).parent().as('blog');
				cy.get('@blog').find('.view-button').click();
			})

			it('A user can like a blog', () => {
				cy.get('@blog').find('.like-button').click();

				cy.get('@blog').contains('likes: 1');
			});

			it.only('The user who created the blog can delete it', () => {
				cy.get('@blog').find('.remove-blog-button');
				cy.get('@blog').find('.remove-blog-button').click();

				cy.should('not.contain', primaryBlogTitle);
			});

			it('A user cannot delete a blog that wasnt created by them', () => {
				const newUser = {
					username: 'badactor',
					password: 'testpassword',
					name: 'Bad Actor'
				};

				cy.request('POST', 'http://localhost:3003/api/users', newUser);
				cy.login({ username: newUser.username, password: newUser.password });

				cy.contains(primaryBlogTitle).parent().as('blog');
				cy.get('@blog').find('.view-button').click();
				cy.get('@blog').should('not.contain', '.remove-blog-button');
			});
		});

		describe.only('and multiple blogs exist', () => {
			beforeEach(() => {
				testBlogs.forEach((blog, index) => {
					const blogTitle = `${blog.title} ${blog.author}`;

					cy.createBlog(blog);

					cy
						.contains(blogTitle)
						.parent()
						.as(blog.title)
						.find('.view-button')
						.click();

					for (var i = 0; i <= index; i++) {
						cy.get(`@${blog.title}`).find('.like-button').click();
					}
				});

				cy.visit('http://localhost:3000');
			});

			it('Blogs are ordered by likes', () => {
				cy.get('.blog').eq(0).should('contain', testBlogs[2].title);
				cy.get('.blog').eq(1).should('contain', testBlogs[1].title);
				cy.get('.blog').eq(2).should('contain', testBlogs[0].title);
			});
		});
	});
});