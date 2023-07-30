import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';
import { Fingerprint } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

const Assignment = (props) => {
    const [isLoad, setIsLoad]=useState(false)
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
    const [dat, setDat] = useState({});
    const [options, setOptions] = useState([]);
    const [depts, setdepts] = useState([]);
    const [branch, setBranch] = useState();
    const [sem, setSem] = useState();
    const [auth, setAuth] = useState(false)

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("http://localhost:5000/checkgAuth", { withCredentials: true });
                const data = response.data.msg_type;
                if (data == "success") {
                    setAuth(true)
                    setIsLoad(true)
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        }
        checkAuth();
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/courses", { withCredentials: true });
                const data = response.data.response;
                setDat(data);
                const items = Object.keys(data);
                setdepts(items);
                setOptions(data[items[0]][1]);
                
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchData();
    }, [navigate]);

    const onSubmit = (fdata) => {
        if (!auth) {
            toast.error("Google authorisation required!", toastOptions);
            return;
        }
        axios.post('http://localhost:5000/addCalendar', fdata, { withCredentials: true })
            .then((res) => {
                if (res.status == 200) {
                    toast.success("Assignment added successfully", toastOptions);
                    navigate("/")
                }
            })
            .catch((error) => console.log(error))
    };

    useEffect(() => {
        if (dat && dat[branch] && dat[branch][sem]) {
            setOptions(dat[branch][sem]);
        }
    }, [sem, branch, dat]);

    const form = (
        <div>
            <div className="container ass">
                <h1>Create Assignment</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="data">
                        <label htmlFor="name">Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            type="text"
                            id="name"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="data">
                        <label htmlFor="branch">Branch</label>
                        <Controller
                            name="branch"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select {...field} onChange={(e) => {
                                    setBranch(e.target.value);
                                    field.onChange(e);
                                }} >
                                    <option value="" disabled>Select a branch</option>
                                    {depts.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            rules={{ required: 'Please select a branch' }}
                        />
                    </div>

                    <div className="data">
                        <label htmlFor="sem">Semester</label>
                        <Controller
                            name="sem"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select {...field} onChange={(e) => {
                                    setSem(e.target.value);
                                    field.onChange(e);
                                }} >
                                    <option value="" disabled>Select a Semester</option>
                                    {numbers.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            rules={{ required: 'Please select a sem' }}
                        />
                    </div>

                    <div className="data">
                        <label htmlFor="course">Course</label>
                        <Controller
                            name="course"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select {...field}>
                                    <option value="" disabled>Select a course</option>
                                    {Object.keys(options).map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            rules={{ required: 'Please select a course' }}
                        />
                    </div>

                    <div className="data">
                        <label htmlFor="due">Due date</label>
                        <Controller
                            name="due"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Please select a date and time' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="datetime-local"
                                    id="due"
                                />
                            )}
                        />
                        {errors.dateTime && <span>{errors.dateTime.message}</span>}
                    </div>
                    <div className="btn">
                        {auth ?
                            (<button type="submit" className="nbtn">Create</button>) :
                            (<button className="gbtn" onClick={(e) => {
                                e.preventDefault()
                                window.location.href = "http://localhost:5000/gAuth"
                            }}><span className="icon"><Fingerprint size={24} /></span>  Authorise Google Calendar</button>)
                        }
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div>
            <Layout isLoad={!isLoad} />
            {form}
        </div>
    );
};

export default Assignment;
