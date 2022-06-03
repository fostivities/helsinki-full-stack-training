import { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

const Togglable = forwardRef((props, ref) => {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	}

	const displayView = () => (
		<div>
			{props.children}
			<button onClick={toggleVisibility}>cancel</button>
		</div>
	);

	const hideView = () => (
		<button onClick={toggleVisibility}>{props.buttonLabel}</button>
	);

	useImperativeHandle(ref, () => {
		return {
			toggleVisibility
		};
	});

	return (
		<div>
			{isVisible
				? displayView()
				: hideView()
			}
		</div>
	);
});

Togglable.propTypes = {
	buttonLabel: PropTypes.string.isRequired
};

Togglable.displayName = 'Togglable';

export default Togglable;
