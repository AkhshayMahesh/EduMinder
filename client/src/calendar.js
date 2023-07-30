import { useState, useEffect, useMemo } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { XCircle } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const Calendardisp = () => {

    var today = new Date()
    const [events, setEvents] = useState([]);
    const [visibleRange, setVisibleRange] = useState({
        start: new Date(`${today.getFullYear}-${today.getMonth}-01`),
        end: new Date(`${today.getFullYear}-${today.getMonth}-${28}`),
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };
    const extractEventDetails = (description) => {
        const regex = /(\w+)_(sem\d+)_(\w+)/;
        const match = description.match(regex);
        if (match) {
            const [, branch, sem, course] = match;
            return { branch, sem, course };
        }
        return null;
    };

    useEffect(() => {
        const { start, end } = visibleRange;
        const fetchEvents = (startD, endD) => {
            axios.post('http://localhost:5000/calendarList', { start: startD, end: endD, }, { withCredentials: true })
                .then((response) => {
                    const temp = response.data.map(event => ({
                        id: event.id,
                        title: event.summary,
                        start: new Date(event.start.dateTime),
                        end: new Date(event.end.dateTime),
                        description: event.description
                        // You can add other event properties if needed, such as description, location, etc.
                    }));
                    setEvents(temp);
                })
                .catch((error) => {
                    console.error('Error fetching events:', error);
                });
        };
        fetchEvents(start, end);
    }, [visibleRange]);

    return (
        <div>
            <Layout />
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    views={{ month: true, week: true, day: true, agenda: true }}
                    style={{ height: 580 }}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleEventClick}
                />
            </div>
            {selectedEvent && (
                <dialog open className="event-dialog">
                    <button className="close-button" onClick={() => setSelectedEvent(null)}>
                        <XCircle size={24} />
                    </button>
                    <h2>{selectedEvent.title}</h2>
                    {selectedEvent.end && (
                        <p>
                            Due: {moment(selectedEvent.end).format("MMMM Do, YYYY")}
                        </p>
                    )}
                    {selectedEvent.description && (
                        <div>
                            <h4>Event Details:</h4>
                            {extractEventDetails(selectedEvent.description) ? (
                                <ul>
                                    <li>
                                        Branch: {extractEventDetails(selectedEvent.description).branch}
                                    </li>
                                    <li>
                                        Semester: {extractEventDetails(selectedEvent.description).sem}
                                    </li>
                                    <li>
                                        Course: {extractEventDetails(selectedEvent.description).course}
                                    </li>
                                </ul>
                            ) : (
                                <p>{selectedEvent.description}</p>
                            )}
                        </div>
                    )}
                </dialog>
            )}
        </div>
    )
}

export default Calendardisp;