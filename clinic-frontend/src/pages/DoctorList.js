import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/doctors/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setDoctors(res.data));

        axios.get('http://127.0.0.1:8000/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setSlots(res.data));
    }, []);

const bookSlot = async (slotId) => {
    try {
        await axios.post('http://127.0.0.1:8000/appointments_router/', {
            slot: slotId,
            status: 'booked'
        }, {
            headers: { Authorization: `Token ${token}` }
        });
        await axios.patch(`http://127.0.0.1:8000/slots_router/${slotId}/`, {
            is_booked: true
        }, {
            headers: { Authorization: `Token ${token}` }
        });
        alert('Appointment booked successfully!');
        // window.location.reload() 지우고 이걸로
        const res = await axios.get('http://127.0.0.1:8000/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        });
        setSlots(res.data);
    } catch (err) {
        alert('Booking failed. Slot may already be booked.');
    }
};

    return (
        <div>
            <h2>Available Doctors</h2>
            {doctors.map(doctor => (
                <div key={doctor.id}>
                    <h3>{doctor.name} - {doctor.specialty}</h3>
                    <h4>Available Slots:</h4>
                    {slots.filter(s => s.doctor === doctor.id && !s.is_booked).map(slot => (
                        <div key={slot.id}>
                            <p>Date: {slot.date} | Time: {slot.time}</p>
                            <button onClick={() => bookSlot(slot.id)}>Book</button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default DoctorList;