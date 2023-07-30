import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import Layout from "./layout";
import SidePanel from './sidePanel';

const Home = (props) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(false)
    const [resp, setResp]=useState()

    useEffect(() => {
        if (!props.isLoggedIn) {
            navigate("/login")
        }
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:5000/checkgAuth", { withCredentials: true });
                const data = response.data.msg_type;
                if (data == "success") setAuth(true)
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }
        checkAuth();
    }, [navigate]);

    return (
        <div>
            <Layout />
            <SidePanel />
        </div>
    );
}

export default Home;