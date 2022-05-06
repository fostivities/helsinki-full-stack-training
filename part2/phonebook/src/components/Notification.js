const Notification = ({ message, style }) => {
    const SUCCESS_COLOR = 'green';
    const ERROR_COLOR = 'red';
    const notificationStyle = {
        color: style === 'success' ? SUCCESS_COLOR : ERROR_COLOR,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    };

    if (message === null) {
        return null;
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    );
}

export default Notification;