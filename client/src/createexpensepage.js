import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';
import { Fingerprint } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

const Expense = (props) => {
    const [isLoad, setIsLoad] = useState(false)
    const { handleSubmit, control, register, formState: { errors } } = useForm();
    const navigate = useNavigate();
    // const [auth, setAuth] = useState(false)
    const types = ["Food", "Health", "Travel", "Clothing", "Essentials", "Accessories", "Others",]

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    // useEffect(() => {
    //     const checkAuth = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:5000/checkgAuth", { withCredentials: true });
    //             const data = response.data.msg_type;
    //             if (data == "success") {
    //                 setAuth(true)
    //                 setIsLoad(true)
    //             }
    //         } catch (error) {
    //             console.log("Error fetching data:", error);
    //         }
    //     }
    //     checkAuth();
    // }, [navigate]);

    const onSubmit = (fdata) => {
        axios.post('http://localhost:5000/addExpense', fdata, { withCredentials: true })
            .then((res) => {
                if (res.status == 200) {
                    toast.success("Expense added successfully", toastOptions);
                    navigate("/")
                }
            })
            .catch((error) => console.log(error))
    };

    const form = (
        <div>
            <div className="container ass">
                <h1>Create Expense</h1>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="data">
                        <label htmlFor="Amount">Amount (in Rupees)</label>
                        <input
                            {...register('Amount', { required: 'Amount is required' })}
                            type="number"
                            id="Amount"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="data">
                        <label htmlFor="desc">Description</label>
                        <textarea
                            {...register('desc', { required: 'Desc is required' })}
                            type="text"
                            id="desc"
                        />
                        {errors.name && <span>{errors.name.message}</span>}
                    </div>

                    <div className="data">
                        <label htmlFor="type">Category</label>
                        <Controller
                            name="type"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <select {...field} >
                                    <option value="" disabled>Select a category</option>
                                    {types.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            rules={{ required: 'Please select a type' }}
                        />
                    </div>

                    <div className="data">
                        <label htmlFor="date">Date</label>
                        <Controller
                            name="date"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Please select a date and time' }}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="datetime-local"
                                    id="date"
                                />
                            )}
                        />
                        {errors.dateTime && <span>{errors.dateTime.message}</span>}
                    </div>

                    <div className="btn">
                        (<button type="submit" className="nbtn">Add</button>) :
                        {/* (<button className="gbtn" onClick={(e) => {
                                e.preventDefault()
                                window.location.href = "http://localhost:5000/gAuth"
                            }}><span className="icon"><Fingerprint size={24} /></span>  Authorise Google Calendar</button>)
                        } */}
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

export default Expense;
