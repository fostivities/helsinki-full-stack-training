const anecdotesAtStart = [
	'If it hurts, do it more often',
	'Adding manpower to a late software project makes it later!',
	'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
	'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
	'Premature optimization is the root of all evil.',
	'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
	return {
		content: anecdote,
		id: getId(),
		votes: 0
	}
};

const sortAnecdotes = (anecdotes) => {
	anecdotes = anecdotes.sort((anecdoteA, anecdoteB) => anecdoteB.votes - anecdoteA.votes);

	return anecdotes;

}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
	let newState = state;

	switch (action.type) {
		case 'VOTE':
			const id = action.data.id;
			const anecdote = state.find(a => a.id === id);
			const newAnecdote = { ...anecdote, votes: anecdote.votes + 1 };

			newState = state.map(a => a.id === id ? newAnecdote : a);
			break;
		case 'ADD_ANECDOTE':
			const addedAnecdote = {
				content: action.data.content,
				votes: 0,
				id: getId()
			}; 
			const updatedAnecdotes = [ ...state, addedAnecdote ];

			newState = updatedAnecdotes;
			break;
		default:
			newState = state;
			break;
	};

	newState = sortAnecdotes(newState);

	return newState
}

export const addVote = (id) => {
	return {
		type: 'VOTE',
		data: { id }
	};
};

export const createAnecdote = (newAnecdote) => {
	return {
		type: 'ADD_ANECDOTE',
		data: { content: newAnecdote }
	};
};

export default reducer