/** Root component of the application that wraps the main ChurnPredictionForm component */
import ChurnPredictionForm from './components/ChurnPredictionForm';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <ChurnPredictionForm />
    </div>
  );
};

export default App;