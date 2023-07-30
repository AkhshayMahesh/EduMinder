import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from 'axios'
import Layout from './layout';
import Assignment from './createasspage';
import Event from './createeventpage';
import Home from './homepage';
import UserLogin from './loginpage';
import UserRegister from './registerpage';
import Calendardisp from "./calendar";
import SidePanel from './sidePanel';
import Credit from "./createcreditpage"
import Expense from "./createexpensepage"
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function App() {
  var navigate = useNavigate()
  const [session, setSession] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState();

  useEffect(() => {
    axios.get('http://localhost:5000/session', { withCredentials: true })
      .then((res) => {
        const { data } = res;
        if (data.msg_type === 'success') {
          setSession(data.session);
          setIsLoggedIn(data.session.isLoggedIn);
        } else {
          setIsLoggedIn(false);
          navigate('/login');
        }
      })
      .catch((error) => {
        console.log(error);
        navigate('/login');
      });
  },[navigate]);

  return (
    <div>
        <Routes>
          <Route index element={<SidePanel session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/create" element={<Assignment session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/create-event" element={<Event session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/create-credit" element={<Credit session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/create-expense" element={<Expense session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/calendar" element={<Calendardisp session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<UserLogin session={session} isLoggedIn={isLoggedIn} />} />
          <Route path="/register" element={<UserRegister session={session} isLoggedIn={isLoggedIn}/>} />
        </Routes>
        <ToastContainer/>
    </div>
  );
}
export default App;

