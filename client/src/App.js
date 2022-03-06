import classes from './App.module.css';
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import {BrowserRouter,Route, Routes} from "react-router-dom";
import Profile from './Components/Profile/Profile';
function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile/>} /> 
        <Route path="*" element={<h2>Page Not found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
