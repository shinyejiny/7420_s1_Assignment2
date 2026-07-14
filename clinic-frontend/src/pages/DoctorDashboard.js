import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://7420-s1-assignment2.vercel.app';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', time: '' });
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    useEffect(() => {
        fetchAppointments();
        fetchSlots();
    }, []);

    const fetchAppointments = () => {
        axios.get(`${API}/doctor-appointments/`, { headers })
            .then(res => setAppointments(res.data));
    };

    const fetchSlots = () => {
        axios.get(`${API}/doctor-slots/`, { headers })
            .then(res => setSlots(res.data));
    };

    const addSlot = async () => {
        try {
            await axios.post(`${API}/doctor-add-slot/`, newSlot, { headers });
            setNewSlot({ date: '', time: '' });
            fetchSlots();
            alert('Slot added!');
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to add slot.');
        }
    };

    const deleteSlot = async (slotId) => {
        await axios.delete(`${API}/slots_router/${slotId}/`, { headers });
        fetchSlots();
    };

    const updateAppointmentStatus = async (aptId, status) => {
        await axios.patch(`${API}/doctor-appointments/${aptId}/update/`,
            { status }, { headers });
        fetchAppointments();
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">👨‍⚕️ Doctor Dashboard</h2>

            {/* 내 슬롯 관리 */}
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h4>My Slots</h4>
                    <div className="d-flex gap-2 mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={newSlot.date}
                            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={newSlot.time}
                            onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                        />
                        <button className="btn btn-primary" onClick={addSlot}>
                            Add Slot
                        </button>
                    </div>
                    {slots.length === 0 && <p className="text-muted">No slots yet.</p>}
                    {slots.map(slot => (
                        <div key={slot.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>📅 {slot.date} ⏰ {slot.time} — {slot.is_booked ? '🔴 Booked' : '🟢 Available'}</span>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(slot.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 내 예약 목록 */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h4>Patient Appointments</h4>
                    {appointments.length === 0 && <p className="text-muted">No appointments yet.</p>}
                    {appointments.map(apt => (
                        <div key={apt.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>
                                📅 Slot: {apt.slot} — Status: <span className={`badge ${apt.status === 'accepted' ? 'bg-success' : apt.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>{apt.status}</span>
                            </span>
                            <div className="d-flex gap-2">
                                <button className="btn btn-success btn-sm" onClick={() => updateAppointmentStatus(apt.id, 'accepted')}>
                                    Accept
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => updateAppointmentStatus(apt.id, 'rejected')}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DoctorDashboard;