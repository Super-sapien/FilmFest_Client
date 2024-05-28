import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import NotFound from "./components/NotFound";
import Films from "./components/Films/Films";
import Film from "./components/Films/Film";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import SnackLogin from "./components/SnackBar/SnackLogin";
// import ManageFilms from "./components/Account/ManageFilms";
import ManageAccount from "./components/Account/ManageAccount";
// import ManageReviews from "./components/Account/ManageReviews";
// import MyFilms from "./components/Account/MyFilms";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
              <Route path="/" element={<Navigate to={"/films"}/>}/>
              <Route path="/films" element={<Films/>}/>
              <Route path="/films/:id" element={<Film/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="*" element={<NotFound/>}/>
              <Route path="/register" element={<Register/>}/>
              <Route path="/manageAccount" element={<ManageAccount/>}/>
            </Routes>

            <SnackLogin />
          </div>
        </Router>
      </div>
  );
}

export default App;