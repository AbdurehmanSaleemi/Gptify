import './App.css';
import Landing from './pages/landing.jsx';
import Text from './pages/Text.jsx';
import { Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Image from './pages/Image';
import Answer from './pages/Answer';
import LongText from './pages/LongText';

function App() {
  return (
    <div className="App">
      <div className="flex flex-col parent min-h-screen min-w-screen">
        <Router>
          <Route exact path="/" component={Landing} />
          <Route exact path="/text" component={Text} />
          <Route exact path="/longtext" component={LongText} />
          <Route exact path="/image" component={Image} />
          <Route exact path="/answer" component={Answer} />
        </Router>
      </div>
    </div>
  );
}

export default App;