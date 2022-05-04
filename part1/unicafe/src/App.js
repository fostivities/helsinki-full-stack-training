import {useState} from 'react'

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  }

  const handleBadClick = () => {
    setBad(bad + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button handleClick={handleGoodClick} text='good' />
        <Button handleClick={handleNeutralClick} text='neutral' />
        <Button handleClick={handleBadClick} text='bad' />
      </div>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

const Statistics = ({ good, neutral, bad }) => {

  const getTotal = () => {
    const total = good + neutral + bad;

    return total;
  }

  const getAverage = () => {
    const total = getTotal();
    const average = (good + (bad * -1)) / total;

    return average;
  }

  const getPositive = () => {
    const total = getTotal();
    const positive = (good / total) * 100;
    const positiveText = positive + '%';

    return positiveText;
  }

  const getStatisticsDisplay = () => {
    const total = getTotal();

    if (total) {
      return (
        <div>
          <h1>statistics</h1>
          <table>
            <tbody>
              <StatisticLine text='good' value={good} />
              <StatisticLine text='neutral' value={neutral} />
              <StatisticLine bad value={bad} />
              <StatisticLine text='all' value={getTotal()} />
              <StatisticLine text='average' value={getAverage()} />
              <StatisticLine text='positive' value={getPositive()} />
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div>
          No feedback given
        </div>
      );
    }
  }

  return (
    <div>
      <h1>statistics</h1>
      {getStatisticsDisplay()}
    </div>
  );
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
);

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

export default App;
