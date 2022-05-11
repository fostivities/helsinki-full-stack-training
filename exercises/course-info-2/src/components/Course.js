const Course = ({ course }) => {
    return (
        <div>
            <Header courseName={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    );
};

const Header = ({ courseName }) => (
    <h2>{courseName}</h2>
);

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </div>
    );
}

const Part = ({ part }) => (
    <p>{part.name} {part.exercises}</p>
);

const Total = ({ parts }) => {
    const total = parts.reduce((previous, current) => previous + current.exercises, 0);

    return (
        <b>
            total of {total} exercises
        </b>
    );
};

export default Course;