
import LoginForm from './Components/LoginForm/LoginForm';
import { Routes, Route } from 'react-router-dom';
import {Register} from './Components/register'
import Dashboard from './Components/dashboard';

function App() {
  return (
      <Routes>
        <Route path='/' element = {<Dashboard/>} />
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    
  );
}

export default App;
