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
            // 기존 슬롯 해제
            await axios.patch(`http://127.0.0.1:8000/slots_router/${appointment.slot}/`, {
                is_booked: false
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            // 새 슬롯 업데이트
            await axios.patch(`http://127.0.0.1:8000/appointments_router/${id}/`, {
                slot: selectedSlot
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            // 새 슬롯 booked로
            await axios.patch(`http://127.0.0.1:8000/slots_router/${selectedSlot}/`, {
                is_booked: true
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            // 데이터 새로고침
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
            <h2>My Appointments</h2>
            {appointments.length === 0 && <p>No appointments found.</p>}
            {appointments.map(appointment => {
                const slot = slots.find(s => s.id === appointment.slot);
                return (
                    <div key={appointment.id}>
                        <p>Date: {slot ? slot.date : 'N/A'}</p>
                        <p>Time: {slot ? slot.time : 'N/A'}</p>
                        <p>Status: {appointment.status}</p>
                        {editingId === appointment.id ? (
                            <div>
                                <select onChange={(e) => setSelectedSlot(e.target.value)} value={selectedSlot}>
                                    <option value="">Select new slot</option>
                                    {availableSlots.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.date} {s.time}
                                        </option>
                                    ))}
                                </select>
                                <button onClick={() => saveEdit(appointment.id)} disabled={!selectedSlot}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel Edit</button>
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => startEdit(appointment)}>Edit</button>
                                <button onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Appointments;