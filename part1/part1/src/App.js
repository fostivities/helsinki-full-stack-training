import { useState } from 'react';

// const Display = ({ counter }) => <div>{counter}</div>;

// const Button = ({ handleClick, text }) => {
//   return (
//     <button onClick={handleClick}>
//       {text}
//     </button>
//   );
// };

// const App = () => {
//   const [ counter, setCounter ] = useState(0);

//   const increaseByOne = () => setCounter(counter + 1);

//   const setToZero = () => setCounter(0);

//   const decreaseByOne = () => setCounter(counter - 1);

//   return (
//     <div>
//       <Display counter={counter} />
//       <Button onClick={increaseByOne} text='plus' />
//       <Button onClick={setToZero} text='zero' />
//       <Button onClick={decreaseByOne} text='decrease' />
//     </div>
//   );
// };

// const App = () => {
//   const [ left, setLeft ] = useState(0);
//   const [ right, setRight ] = useState(0);
//   const [ allClicks, setAll ] = useState([]);

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'));
//     setLeft(left + 1);
//   };

//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'));
//     setRight(right + 1);
//   };

//   return (
//     <div>
//       {left}
//       <Button handleClick={handleLeftClick} text='left' />
//       <Button handleClick={handleRightClick} text='right' />
//       {right}
//       <History allClicks={allClicks} />
//     </div>
//   )
// }

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return (
//       <div>
//         the app is used by pressing the buttons
//       </div>
//     );
//   }

//   return (
//     <div>
//       button press history: {props.allClicks.join(' ')}
//     </div>
//   );
// }

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

// Do not define components inside another component
const Display = props => <div>{props.value}</div>

const App = () => {
  const [value, setValue] = useState(10);

  const setToValue = (newValue) => {
    console.log('value now', newValue);
    setValue(newValue);
  };

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}

export default App;