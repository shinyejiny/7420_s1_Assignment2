import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/appointments_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setAppointments(res.data));

        axios.get('http://127.0.0.1:8000/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setSlots(res.data));
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

    const startEdit = (appointment) => {
        setEditingId(appointment.id);
        setAvailableSlots(slots.filter(s => !s.is_booked));
        setSelectedSlot('');
    };

    const saveEdit = async (id) => {
        try {
            const appointment = appointments.find(a => a.id === id);
            await axios.patch(`http://127.0.0.1:8000/slots_router/${appointment.slot}/`, {
                is_booked: false
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            await axios.patch(`http://127.0.0.1:8000/appointments_router/${id}/`, {
                slot: selectedSlot
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            await axios.patch(`http://127.0.0.1:8000/slots_router/${selectedSlot}/`, {
                is_booked: true
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            const res = await axios.get('http://127.0.0.1:8000/appointments_router/', {
                headers: { Authorization: `Token ${token}` }
            });
            setAppointments(res.data);
            const slotsRes = await axios.get('http://127.0.0.1:8000/slots_router/', {
                headers: { Authorization: `Token ${token}` }
            });
            setSlots(slotsRes.data);
            setEditingId(null);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2 className="mb-4">My Appointments</h2>
            {appointments.length === 0 && (
                <div className="alert alert-info">No appointments found.</div>
            )}
            <div className="row">
                {appointments.map(appointment => {
                    const slot = slots.find(s => s.id === appointment.slot);
                    return (
                        <div key={appointment.id} className="col-md-6 mb-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <p>📅 Date: <strong>{slot ? slot.date : 'N/A'}</strong></p>
                                    <p>⏰ Time: <strong>{slot ? slot.time : 'N/A'}</strong></p>
                                    <p>Status: <span className="badge bg-success">{appointment.status}</span></p>
                                    {editingId === appointment.id ? (
                                        <div>
                                            <select
                                                className="form-select mb-2"
                                                onChange={(e) => setSelectedSlot(e.target.value)}
                                                value={selectedSlot}
                                            >
                                                <option value="">Select new slot</option>
                                                {availableSlots.map(s => (
                                                    <option key={s.id} value={s.id}>
                                                        {s.date} {s.time}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => saveEdit(appointment.id)}
                                                disabled={!selectedSlot}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => startEdit(appointment)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => cancelAppointment(appointment.id)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Appointments;