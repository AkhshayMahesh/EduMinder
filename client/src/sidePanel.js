import { useState, useEffect } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import Layout from "./layout";
import Graph from './graph';
import Graph2 from "./graph2";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { TrendingUp, Calendar, Clipboard, IndianRupee, Bell, Plus, Fingerprint, Trash, CheckCircle } from 'lucide-react';

const SidePanel = (props) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Assignments');
    const [notificationCount, setNotificationCount] = useState(7);
    const [auth, setAuth] = useState(false)
    const [isLoad, setIsLoad] = useState(false)

    const DateTimeSplitter = (dateTimeString, str) => {
        if (!dateTimeString || typeof dateTimeString !== 'string') {
            return <p>Invalid date and time format</p>;
        }
        const regex = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}\.\d{3})Z$/;
        const matchResult = dateTimeString.match(regex);
        if (matchResult) {
            const datePart = matchResult[1];
            const timePart = matchResult[2];

            return (
                <div>
                    <p>{(str != "none") ? str : ""} Date: {datePart}</p>
                    <p>{(str != "none") ? str : ""} Time: {timePart}</p>
                </div>
            );
        } else {
            return <p>Invalid date and time format</p>;
        }
    };

    const AssignmentList = () => {
        const [assignments, setAssignments] = useState([]);
        const [currentIndex, setCurrentIndex] = useState();

        useEffect(() => {
            axios.get('http://localhost:5000/assignments', { withCredentials: true })
                .then((response) => {
                    const sortedAssignments = response.data.sort((a, b) => new Date(a.due) > new Date(b.due));
                    // console.log(sortedAssignments)
                    setAssignments(sortedAssignments);
                    setIsLoad(true)
                }).catch((error) => {
                    console.error('Error fetching assignments:', error);
                });
        }, []);

        return (
            <div className="Lists">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h1 style={{ margin: "auto" }}>Assignments</h1>
                </div>

                <div className="assignment-carousel">
                    <Carousel
                        showThumbs={true}
                        showArrows={true}
                        infiniteLoop={true}
                        selectedItem={currentIndex}
                        onChange={(index) => setCurrentIndex(index)}
                    >
                        {assignments.map((assignment, index) => {
                            const isOverdue = new Date(assignment.due) < new Date();
                            return (
                                <div
                                    key={assignment._id}
                                    className={`assignment ${isOverdue ? 'overdue' : ''}`}
                                >
                                    {isOverdue ? (
                                        <div className="delete-icon">
                                            <Trash size={24} />
                                        </div>
                                    ) : (
                                        <div className="tick-icon">
                                            <CheckCircle size={24} />
                                        </div>
                                    )}
                                    <h3 className="assignmentTitle" >{assignment.name}</h3>
                                    {DateTimeSplitter(assignment.due, "none")}
                                    <p>Course: {assignment.course}</p>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
                <div className="add-item-icon" >
                    <Link to="/create">
                        <Plus size={30} />
                    </Link>
                </div>
            </div>
        );
    };

    const EventList = () => {
        const [events, setEvents] = useState([]);
        const [currentIndex, setCurrentIndex] = useState();

        useEffect(() => {
            axios.get('http://localhost:5000/events', { withCredentials: true })
                .then((response) => {
                    // console.log(response.data)
                    const sortedEvents = response.data.sort((a, b) => new Date(a.due) > new Date(b.due));
                    // console.log(sortedEvents)
                    setEvents(sortedEvents);
                    setIsLoad(true);
                }).catch((error) => {
                    console.error('Error fetching events:', error);
                });
        }, []);

        return (
            <div className="Lists">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h1 style={{ margin: "auto" }}>Events</h1>
                </div>

                <div className="assignment-carousel">
                    <Carousel
                        showThumbs={true}
                        showArrows={true}
                        infiniteLoop={true}
                        selectedItem={currentIndex}
                        onChange={(index) => setCurrentIndex(index)}
                    >
                        {events.map((assignment, index) => {
                            const isOverdue = new Date(assignment.end) < new Date();
                            return (
                                <div
                                    key={assignment._id}
                                    className={`assignment eve ${isOverdue ? 'overdue' : ''}`}
                                >
                                    {isOverdue ? (
                                        <div className="delete-icon">
                                            <Trash size={24} />
                                        </div>
                                    ) : (
                                        <div className="tick-icon">
                                            <CheckCircle size={24} />
                                        </div>
                                    )}
                                    <h3 className="assignmentTitle" >{assignment.name}</h3>
                                    {DateTimeSplitter(assignment.start, "Start")}
                                    {DateTimeSplitter(assignment.end, "End")}<br></br>
                                    <p>{assignment.desc}</p>
                                </div>
                            );
                        })}
                    </Carousel>
                </div>
                <div className="add-item-icon" >
                    <Link to="/create-event">
                        <Plus size={30} />
                    </Link>
                </div>
            </div>
        );
    };

    const ExpenseList = () => {
        const [expenses, setExpenses] = useState([]);
        const [credits, setCredits] = useState();
        const [expense, setExpense] = useState();
        const [credit, setCredit] = useState();
        const [selected, setSelected] = useState("week");
        var typedExpense;
        const temp = [200, 20, 23, 100, 365, 234, 567]
        const types = ["Food", "Health", "Travel", "Clothing", "Essentials", "Accessories", "Others",]

        function formatDateToISO(isoString) {
            const date = new Date(isoString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        }

        const calculateCategoryTotals = (expenses) => {
            return expenses.reduce((totals, expense) => {
                const { amount, type } = expense;
                if (totals[type]) {
                    totals[type] += amount;
                } else {
                    totals[type] = amount;
                }
                return totals;
            }, {});
        };

        useEffect(() => {
            const getExpenses = () => {
                axios.get('http://localhost:5000/expenses', { withCredentials: true })
                    .then(async (response) => {
                        setExpenses(response.data);
                        const temp = await response.data.map(({ date, amount }) => ({ date: formatDateToISO(date), amount }));
                        setExpense(temp);
                        // typedExpense = calculateCategoryTotals(expenses)
                    }).catch((error) => {
                        console.error('Error fetching events:', error);
                    });
            }
            getExpenses();
            const getCredits = () => {
                axios.get('http://localhost:5000/credits', { withCredentials: true })
                    .then(async (response) => {
                        setCredits(response.data)
                        const temp = await response.data.map(({ date, amount }) => ({ date: formatDateToISO(date), amount }));
                        setCredit(temp);
                        setIsLoad(true)
                    }).catch((error) => {
                        console.error('Error fetching events:', error);
                    });
            }
            getCredits();
        }, [])

        return (
            <div style={{ height: "85%" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h1 style={{ margin: "auto" }}>Expenses</h1>
                </div>
                {(selected == "week") ?
                    <Graph expenses={expense} credits={credit} /> :
                    <Graph2 categoryTotals={calculateCategoryTotals(expenses)} categoryLimits={temp} />
                }
                <div className="btn-holder">
                    <div className="add-item" >
                        <Link to="/create-expense">
                            <Plus size={24} /> Expense
                        </Link>
                    </div>
                    {(selected == "week") ?
                        (<div className="add-item" >
                            <button onClick={() => setSelected("types")}>
                                Categories
                            </button>
                        </div>) :
                        (<div className="add-item" >
                            <button onClick={() => setSelected("week")}>
                                Timeline
                            </button>
                        </div>)
                    }
                    <div className="add-item" >
                        <Link to="create-credit">
                            <Plus size={24} /> Credit
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
    }, []);

    const handleTabChange = (tab) => {
        setIsLoad(false)
        setActiveTab(tab);
    };

    return (
        <div>
            <Layout isLoad={!isLoad} />
            <div className="side-panel">
                <div
                    className={`tab ${activeTab === 'Assignments' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Assignments')}
                >
                    <Clipboard size={24} />
                </div>
                <div
                    className={`tab ${activeTab === 'Events' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Events')}
                >
                    <Calendar size={24} />
                </div>
                <div
                    className={`tab ${activeTab === 'Expenses' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Expenses')}
                >
                    <IndianRupee size={24} />
                </div>
                <div
                    className={`tab ${activeTab === 'Grades' ? 'active' : ''}`}
                    onClick={() => handleTabChange('Grades')}
                >
                    <TrendingUp size={24} />
                </div>
                <div className={`tab ${activeTab === 'Notifications' ? 'active' : ''}`} onClick={() => handleTabChange('Notifications')}>
                    {auth ? (
                        <div className="notification-icon">
                            <Bell size={24} />
                            {notificationCount > 0 && (
                                <div className="notification-badge">
                                    {notificationCount}
                                </div>
                            )}
                        </div>) : (<Fingerprint size={24} onClick={(e) => {
                            e.preventDefault()
                            window.location.href = "http://localhost:5000/gAuth"
                        }} />)
                    }
                </div>
            </div>
            <div className="tab-content">
                {activeTab === 'Assignments' && <div style={{ height: "100%" }}><AssignmentList /></div>}
                {activeTab === 'Events' && <div style={{ height: "100%" }}><EventList /></div>}
                {activeTab === 'Expenses' && <div style={{ height: "100%" }}><ExpenseList /></div>}
                {activeTab === 'Grades' && <div>Content for Grades goes here</div>}
            </div>
        </div>
    );
};

export default SidePanel;
