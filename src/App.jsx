//import logo from './logo.svg';
import './App.css';

const App = () => {
  const handleClick = () => {
    alert("Bạn vừa bấm nút!");
  };

  return (
    <div>
      <h1>Chào mừng đến React</h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export default App;