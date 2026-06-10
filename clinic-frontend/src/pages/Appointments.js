import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/appointments_router/', {
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setAppointments(res.data))
        .catch(err => console.log(err));

        axios.get('http://127.0.0.1:8000/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setSlots(res.data))
        .catch(err => console.log(err));
    }, []);

const cancelAppointment = async (id) => {
    try {
        const appointment = appointments.find(a => a.id === id);

        await axios.patch(`http://127.0.0.1:8000/slots_router/${appointment.slot}/`, {
            is_booked: false
        }, {
            headers: { Authorization: `Token ${token}` }
        });

        await axios.delete(`http://127.0.0.1:8000/appointments_router/${id}/`, {
            headers: { Authorization: `Token ${token}` }
        });

        setAppointments(appointments.filter(a => a.id !== id));
    } catch (err) {
        console.log(err);
    }
};

    return (
        <div>
            <h2>My Appointments</h2>
            {appointments.length === 0 && <p>No appointments found.</p>}
            {appointments.map(appointment => {
                const slot = slots.find(s => s.id === appointment.slot);
                return (
                    <div key={appointment.id}>
                        <p>Date: {slot ? slot.date : 'N/A'}</p>
                        <p>Time: {slot ? slot.time : 'N/A'}</p>
                        <p>Status: {appointment.status}</p>
                        <button onClick={() => cancelAppointment(appointment.id)}>
                            Cancel
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

export default Appointments;