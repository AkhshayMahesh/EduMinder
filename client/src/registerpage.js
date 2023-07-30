import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

const UserRegister = (props) => {
    const navigate = useNavigate()
    const [Name, setName] = useState('')
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

    const handleRegister = (e) => {
        e.preventDefault()
        const data = { name: Name, username: Username, password: Password }
        axios.post('http://localhost:5000/register', data)
            .then((res) => {
                const { data } = res
                setMessage(data.message)
                setMsgtyp(data.msg_type)
                if (data.msg_type == "success") {
                    toast.success("Registered successfully", toastOptions)
                    navigate("/login")
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
                toast.error('Logout failed', toastOptions);
            });
    };

    const form = (
        <div>
            <div className="container">
                <h1>Sign up</h1>
                <form onSubmit={handleRegister}>
                    <div className="data">
                        <label htmlFor="name">Name</label>
                        <input type="text" id='name' required onChange={(event) => {
                            setName(event.target.value)
                        }}></input>
                    </div>
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
                        <button type="submit" className="nbtn">Sign up</button>
                    </div>
                </form>
                <div className="signup-link">
                    Already a Member? <Link to="/login">Login</Link>
                </div>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );

    return (
        <div>
            <Layout />
            {!isLoggedIn && form}
            {isLoggedIn &&
                <div>
                    <div className="logged"><h1>Hello User!</h1> <button onClick={handleLogout} className="btn" style={{ marginTop: "20px", height: "45px" }}>Logout</button></div>
                </div>
            }

        </div>
    );
}

export default UserRegister;