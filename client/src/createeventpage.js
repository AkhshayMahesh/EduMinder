import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';
import { Fingerprint } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

const Event = (props) => {
    const [isLoad, setIsLoad]=useState(false)
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
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
    }, [navigate]);

    const onSubmit = (fdata) => {
        if(fdata.start > fdata.end) {
            toast.error("Invalid time period", toastOptions)
            return;
        }
        axios.post('http://localhost:5000/addEvent', fdata, { withCredentials: true })
            .then((res) => {
                if (res.status == 200) {
                    toast.success("Event added successfully", toastOptions);
                    navigate("/")
                }
            })
            .catch((error) => console.log(error))
    };

    const form = (
        <div>
            <div className="container ass">
                <h1>Create Event</h1>
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
                        <label htmlFor="Desc">Description</label>
                        <textarea
                            {...register('Desc', { required: 'Desc is required' })}
                            type="text"
                            id="Desc"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="data">
                        <label htmlFor="start">Start date</label>
                        <Controller
                            name="start"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Please select a date and time' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="datetime-local"
                                    id="start"
                                />
                            )}
                        />
                        {errors.dateTime && <span>{errors.dateTime.message}</span>}
                    </div>

                    <div className="data">
                        <label htmlFor="end">End date</label>
                        <Controller
                            name="end"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Please select a date and time' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="datetime-local"
                                    id="end"
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

export default Event;
