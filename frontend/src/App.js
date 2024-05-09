import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LoginSignup from "./LoginSignup"
import UserDetails from "./UserDetails"

function App() {
  
  return (
    <div>
    
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginSignup/>}/>
        <Route path='/userdetails' element={<UserDetails/>}/>
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
