import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://7420-s1-assignment2.vercel.app';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [slots, setSlots] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [newSlot, setNewSlot] = useState({ date: '', time: '' });
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };

    useEffect(() => {
        fetchAppointments();
        fetchSlots();
        axios.get(`${API}/doctors/`, { headers })
            .then(res => setDoctors(res.data));
    }, []);

    const fetchAppointments = () => {
        axios.get(`${API}/doctor-appointments/`, { headers })
            .then(res => setAppointments(res.data));
    };

    const fetchSlots = () => {
        axios.get(`${API}/doctor-slots/`, { headers })
            .then(res => setSlots(res.data));
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(d => d.id === doctorId);
        return doctor ? doctor.name : 'Unknown';
    };

    const getSlotInfo = (slotId) => {
        const slot = slots.find(s => s.id === slotId);
        return slot ? `📅 ${slot.date} ⏰ ${slot.time}` : `Slot #${slotId}`;
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

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <h4>My Slots</h4>
                    <div className="d-flex gap-2 mb-3">
                        <input
                            type="date"
                            className="form-control"
                            value={newSlot.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                        />
                        <select
                            className="form-control"
                            value={newSlot.time}
                            onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}
                        >
                            <option value="">Select Time</option>
                            <option value="08:00">08:00 AM</option>
                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="13:00">01:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                            <option value="17:00">05:00 PM</option>
                        </select>
                        <button className="btn btn-primary" onClick={addSlot}>
                            Add Slot
                        </button>
                    </div>
                    {slots.length === 0 && <p className="text-muted">No slots yet.</p>}
                    {slots.map(slot => (
                        <div key={slot.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>👨‍⚕️ {getDoctorName(slot.doctor)} | 📅 {slot.date} ⏰ {slot.time} — {slot.is_booked ? '🔴 Booked' : '🟢 Available'}</span>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(slot.id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h4>Patient Appointments</h4>
                    {appointments.length === 0 && <p className="text-muted">No appointments yet.</p>}
                    {appointments.map(apt => (
                        <div key={apt.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>
                                {getSlotInfo(apt.slot)} — Status: <span className={`badge ${apt.status === 'accepted' ? 'bg-success' : apt.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>{apt.status}</span>
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