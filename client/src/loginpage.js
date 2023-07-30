import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';


const UserLogin = (props) => {
    const navigate = useNavigate()
    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [msgtyp, setMsgtyp] = useState('')
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    var isLoggedIn = props.isLoggedIn;

    const handleLogin = (e) => {
        e.preventDefault()
        const data = { username: Username, password: Password }
        axios.post('http://localhost:5000/login', data, { withCredentials: true })
            .then((res) => {
                const { data } = res
                setMessage(data.message)
                setMsgtyp(data.msg_type)
                if (data.msg_type === 'success') {
                    toast.success("Login Successful", toastOptions)
                    navigate('/')
                } else {
                    toast.error(data.message, toastOptions)
                }
            })
            .catch((err) => console.log(err))
    }

    const handleLogout = () => {
        axios.post('http://localhost:5000/logout', null, { withCredentials: true })
            .then((res) => {
                window.location.href = "/login";
            })
            .catch((error) => {
                console.log(error);
                toast.error('Logout failed');
            });
    };

    const form = (
        <div>
            <div className="container">
                <h1>User Login</h1>

                <form onSubmit={handleLogin}>
                    <div className="data">
                        <label htmlFor="username">Email</label>
                        <input type="email" id='username' required onChange={(event) => {
                            setUsername(event.target.value)
                        }}></input>
                    </div>
                    <div className="data">
                        <label htmlFor="password">Password</label>
                        <input type="password" id='password' required onChange={(event) => {
                            setPassword(event.target.value)
                        }}></input>
                    </div>
                    <div className="btn">
                        <button type="submit" className="nbtn">Login</button>
                    </div>
                </form>
                <div className="signup-link">
                    Not a Member? <Link to="/register">Sign Up</Link>
                </div>
            </div>
            {/* < ToastContainer /> */}
        </div>)

    return (
        <div>
            <Layout />
            {!isLoggedIn && form}
            {isLoggedIn && 
            <div>
                <div className="logged"><h1>Hello User!</h1> <button onClick={handleLogout} className="btn" style={{marginTop:"20px", height:"45px"}}>Logout</button></div>
            </div>
            }
        </div>
    );
}

export default UserLogin;