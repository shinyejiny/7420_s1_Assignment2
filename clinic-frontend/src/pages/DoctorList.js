import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const token = localStorage.getItem('token');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        axios.get('https://7420-s1-assignment2.vercel.app/doctors/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setDoctors(res.data));

        axios.get('https://7420-s1-assignment2.vercel.app/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setSlots(res.data));
    }, []);

    const bookSlot = async (slotId) => {
        try {
            await axios.post('https://7420-s1-assignment2.vercel.app/appointments_router/', {
                slot: slotId,
                status: 'booked'
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            alert('Appointment booked successfully!');
            const res = await axios.get('https://7420-s1-assignment2.vercel.app/slots_router/', {
                headers: { Authorization: `Token ${token}` }
            });
            setSlots(res.data);
        } catch (err) {
            const errorMsg = err.response?.data?.slot?.[0]
                || err.response?.data?.detail
                || 'Booking failed.';
            alert(errorMsg);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Available Doctors</h2>
            <div className="row">
                {doctors.map(doctor => (
                    <div key={doctor.id} className="col-md-6 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="card-title">{doctor.name}</h4>
                                <p className="text-muted">Specialty: {doctor.specialty}</p>
                                <h6>Available Slots:</h6>
                                {slots.filter(s => s.doctor === doctor.id && !s.is_booked).length === 0 && (
                                    <p className="text-danger">No available slots</p>
                                )}
                                {slots.filter(s => s.doctor === doctor.id && !s.is_booked).map(slot => (
                                    <div key={slot.id} className="d-flex justify-content-between align-items-center mb-2">
                                        <span>📅 {slot.date} ⏰ {slot.time}</span>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => bookSlot(slot.id)}
                                        >
                                            Book
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoctorList;