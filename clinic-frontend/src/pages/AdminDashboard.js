import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const [newSlot, setNewSlot] = useState({ doctor: '', date: '', time: '' });
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editDoctor, setEditDoctor] = useState({ name: '', specialty: '' });
    const token = localStorage.getItem('token');

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        axios.get('https://7420-s1-assignment2.vercel.app/doctors/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setDoctors(res.data));

        axios.get('https://7420-s1-assignment2.vercel.app/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setSlots(res.data));

        axios.get('https://7420-s1-assignment2.vercel.app/appointments_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setAppointments(res.data));

        axios.get('https://7420-s1-assignment2.vercel.app/users_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setUsers(res.data));
    }, []);

    const addDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://7420-s1-assignment2.vercel.app/doctors/create/', newDoctor, {
                headers: { Authorization: `Token ${token}` }
            });
            setDoctors([...doctors, res.data]);
            setNewDoctor({ name: '', specialty: '' });
        } catch (err) {
            console.log(err);
        }
    };

    const deleteDoctor = async (id) => {
        try {
            await axios.delete(`https://7420-s1-assignment2.vercel.app/doctors_router/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setDoctors(doctors.filter(d => d.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const updateDoctor = async (id) => {
        try {
            await axios.put(`https://7420-s1-assignment2.vercel.app/doctors/${id}/update/`, editDoctor, {
                headers: { Authorization: `Token ${token}` }
            });
            setDoctors(doctors.map(d => d.id === id ? { ...d, ...editDoctor } : d));
            setEditingDoctorId(null);
        } catch (err) {
            console.log(err);
        }
    };

    const addSlot = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://7420-s1-assignment2.vercel.app/slots_router/', {
            ...newSlot,
            is_booked: false
            }, {
            headers: { Authorization: `Token ${token}` }
            });
            setSlots([...slots, res.data]);
            setNewSlot({ doctor: '', date: '', time: '' });
        } catch (err) {
            alert('This slot already exists for this doctor!');
        }
    };
    const deleteSlot = async (id) => {
        try {
            await axios.delete(`https://7420-s1-assignment2.vercel.app/slots_router/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setSlots(slots.filter(s => s.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const cancelAppointment = async (id) => {
        try {
            const appointment = appointments.find(a => a.id === id);
            await axios.patch(`https://7420-s1-assignment2.vercel.app/slots_router/${appointment.slot}/`, {
                is_booked: false
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            await axios.delete(`https://7420-s1-assignment2.vercel.app/appointments_router/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setAppointments(appointments.filter(a => a.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (id) => {
        try {
            await axios.delete(`https://7420-s1-assignment2.vercel.app/users_router/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Add Doctor */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">Add Doctor</h4>
                    <form onSubmit={addDoctor} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Doctor Name"
                            value={newDoctor.name}
                            onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Specialty"
                            value={newDoctor.specialty}
                            onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>

            {/* Doctors List */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">Doctors</h4>
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            {editingDoctorId === doctor.id ? (
                                <div className="d-flex gap-2 w-100">
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editDoctor.name}
                                        onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editDoctor.specialty}
                                        onChange={(e) => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
                                    />
                                    <button className="btn btn-success btn-sm" onClick={() => updateDoctor(doctor.id)}>Save</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingDoctorId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <span>{doctor.name} - {doctor.specialty}</span>
                                    <div>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditingDoctorId(doctor.id); setEditDoctor({ name: doctor.name, specialty: doctor.specialty }); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(doctor.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Slot */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">Add Slot</h4>
                    <form onSubmit={addSlot} className="d-flex gap-2">
                        <select
                            className="form-select"
                            value={newSlot.doctor}
                            onChange={(e) => setNewSlot({ ...newSlot, doctor: e.target.value })}
                        >
                            <option value="">Select Doctor</option>
                            {doctors.map(doctor => (
                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            className="form-control"
                            value={newSlot.date}
                            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                        />
                        <input
                            type="time"
                            className="form-control"
                            value={newSlot.time}
                            onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                        />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>

            {/* All Slots */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">All Slots</h4>
                    {slots.map(slot => (
                        <div key={slot.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>📅 {slot.date} ⏰ {slot.time} | {slot.is_booked ? <span className="badge bg-danger">Booked</span> : <span className="badge bg-success">Available</span>}</span>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(slot.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Appointments */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">All Appointments</h4>
                    {appointments.length === 0 && <p className="text-muted">No appointments.</p>}
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>ID: {appointment.id} | Slot: {appointment.slot} | Status: <span className="badge bg-success">{appointment.status}</span></span>
                            <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Patient Accounts */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4 className="card-title">Patient Accounts</h4>
                    {users.filter(u => u.is_patient).map(user => (
                        <div key={user.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            <span>👤 {user.username} - {user.email}</span>
                            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;