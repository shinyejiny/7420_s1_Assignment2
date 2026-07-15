import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'https://7420-s1-assignment2.vercel.app';

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [users, setUsers] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '', username: '', password: '' });
    const [newSlot, setNewSlot] = useState({ doctor: '', date: '', time: '' });
    const [newPatient, setNewPatient] = useState({ username: '', email: '', password: '' });
    const [newBooking, setNewBooking] = useState({ user: '', slot: '' });
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editDoctor, setEditDoctor] = useState({ name: '', specialty: '' });
    const [editingSlotId, setEditingSlotId] = useState(null);
    const [editSlot, setEditSlot] = useState({ date: '', time: '' });
    const [editingAppointmentId, setEditingAppointmentId] = useState(null);
    const [editAppointment, setEditAppointment] = useState({ slot: '' });
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Token ${token}` };
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = () => {
        axios.get(`${API}/doctors/`, { headers }).then(res => setDoctors(res.data));
        axios.get(`${API}/slots_router/`, { headers }).then(res => setSlots(res.data));
        axios.get(`${API}/appointments_router/`, { headers }).then(res => setAppointments(res.data));
        axios.get(`${API}/users_router/`, { headers }).then(res => setUsers(res.data));
    };

    const getAvailableTimes = (selectedDate) => {
        const allTimes = [
            { value: '08:00', label: '08:00 AM' },
            { value: '09:00', label: '09:00 AM' },
            { value: '10:00', label: '10:00 AM' },
            { value: '11:00', label: '11:00 AM' },
            { value: '12:00', label: '12:00 PM' },
            { value: '13:00', label: '01:00 PM' },
            { value: '14:00', label: '02:00 PM' },
            { value: '15:00', label: '03:00 PM' },
            { value: '16:00', label: '04:00 PM' },
            { value: '17:00', label: '05:00 PM' },
        ];
        if (selectedDate === today) {
            const nzTime = new Date().toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland' });
            const currentHour = new Date().getHours();
            return allTimes.filter(t => parseInt(t.value) > currentHour);
        }
        return allTimes;
    };

    const addDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/doctors/create/`, newDoctor, { headers });
            setDoctors([...doctors, res.data]);
            setNewDoctor({ name: '', specialty: '', username: '', password: '' });
        } catch (err) { alert('Failed to add doctor.'); }
    };

    const deleteDoctor = async (id) => {
        await axios.delete(`${API}/doctors_router/${id}/`, { headers });
        setDoctors(doctors.filter(d => d.id !== id));
    };

    const updateDoctor = async (id) => {
        await axios.put(`${API}/doctors/${id}/update/`, editDoctor, { headers });
        setDoctors(doctors.map(d => d.id === id ? { ...d, ...editDoctor } : d));
        setEditingDoctorId(null);
    };

    const addSlot = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/slots_router/`, { ...newSlot, is_booked: false }, { headers });
            setSlots([...slots, res.data]);
            setNewSlot({ doctor: '', date: '', time: '' });
        } catch (err) { alert('This slot already exists!'); }
    };

    const deleteSlot = async (id) => {
        await axios.delete(`${API}/slots_router/${id}/`, { headers });
        setSlots(slots.filter(s => s.id !== id));
    };

    const updateSlot = async (id) => {
        await axios.patch(`${API}/slots_router/${id}/`, editSlot, { headers });
        setSlots(slots.map(s => s.id === id ? { ...s, ...editSlot } : s));
        setEditingSlotId(null);
    };

    const cancelAppointment = async (id) => {
        const appointment = appointments.find(a => a.id === id);
        await axios.patch(`${API}/slots_router/${appointment.slot}/`, { is_booked: false }, { headers });
        await axios.delete(`${API}/appointments_router/${id}/`, { headers });
        setAppointments(appointments.filter(a => a.id !== id));
    };

    const updateAppointment = async (id) => {
        const old = appointments.find(a => a.id === id);
        await axios.patch(`${API}/slots_router/${old.slot}/`, { is_booked: false }, { headers });
        await axios.patch(`${API}/appointments_router/${id}/`, { slot: editAppointment.slot }, { headers });
        await axios.patch(`${API}/slots_router/${editAppointment.slot}/`, { is_booked: true }, { headers });
        fetchAll();
        setEditingAppointmentId(null);
    };

    const deleteUser = async (id) => {
        await axios.delete(`${API}/users_router/${id}/`, { headers });
        setUsers(users.filter(u => u.id !== id));
    };

    const createPatient = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API}/register/`, { ...newPatient, is_patient: true, is_admin: false }, { headers });
            setNewPatient({ username: '', email: '', password: '' });
            axios.get(`${API}/users_router/`, { headers }).then(res => setUsers(res.data));
            alert('Patient created!');
        } catch (err) { alert('Failed to create patient.'); }
    };

    const createBooking = async (e) => {
    e.preventDefault();
    try {
        await axios.post(`${API}/appointments_router/`, {
            slot: newBooking.slot,
            status: 'booked',
            user: newBooking.user   // ← user 추가
        }, { headers });
        await axios.patch(`${API}/slots_router/${newBooking.slot}/`, { is_booked: true }, { headers });
        setNewBooking({ user: '', slot: '' });
        fetchAll();
        alert('Booking created!');
    } catch (err) {
        alert(err.response?.data?.slot?.[0] || 'Failed to create booking.');
    }
};

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Add Doctor */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>Add Doctor</h4>
                    <form onSubmit={addDoctor} className="d-flex gap-2 flex-wrap">
                        <input type="text" className="form-control" placeholder="Doctor Name" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} />
                        <input type="text" className="form-control" placeholder="Specialty" value={newDoctor.specialty} onChange={e => setNewDoctor({ ...newDoctor, specialty: e.target.value })} />
                        <input type="text" className="form-control" placeholder="Username" value={newDoctor.username} onChange={e => setNewDoctor({ ...newDoctor, username: e.target.value })} />
                        <input type="password" className="form-control" placeholder="Password" value={newDoctor.password} onChange={e => setNewDoctor({ ...newDoctor, password: e.target.value })} />
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>

            {/* Doctors List */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>Doctors</h4>
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            {editingDoctorId === doctor.id ? (
                                <div className="d-flex gap-2 w-100">
                                    <input type="text" className="form-control" value={editDoctor.name} onChange={e => setEditDoctor({ ...editDoctor, name: e.target.value })} />
                                    <input type="text" className="form-control" value={editDoctor.specialty} onChange={e => setEditDoctor({ ...editDoctor, specialty: e.target.value })} />
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
                    <h4>Add Slot</h4>
                    <form onSubmit={addSlot} className="d-flex gap-2">
                        <select className="form-select" value={newSlot.doctor} onChange={e => setNewSlot({ ...newSlot, doctor: e.target.value })}>
                            <option value="">Select Doctor</option>
                            {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                        <input type="date" className="form-control" value={newSlot.date} min={today} onChange={e => setNewSlot({ ...newSlot, date: e.target.value, time: '' })} />
                        <select className="form-control" value={newSlot.time} onChange={e => setNewSlot({ ...newSlot, time: e.target.value })}>
                            <option value="">Select Time</option>
                            {getAvailableTimes(newSlot.date).map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">Add</button>
                    </form>
                </div>
            </div>

            {/* All Slots */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>All Slots</h4>
                    {slots.map(slot => (
                        <div key={slot.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            {editingSlotId === slot.id ? (
                                <div className="d-flex gap-2 w-100">
                                    <input type="date" className="form-control" value={editSlot.date} min={today} onChange={e => setEditSlot({ ...editSlot, date: e.target.value, time: '' })} />
                                    <select className="form-control" value={editSlot.time} onChange={e => setEditSlot({ ...editSlot, time: e.target.value })}>
                                        <option value="">Select Time</option>
                                        {getAvailableTimes(editSlot.date).map(t => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                    <button className="btn btn-success btn-sm" onClick={() => updateSlot(slot.id)}>Save</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingSlotId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <span>👨‍⚕️ {slot.doctor_name} | 📅 {slot.date} ⏰ {slot.time} | {slot.is_booked ? <span className="badge bg-danger">Booked</span> : <span className="badge bg-success">Available</span>}</span>
                                    <div>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditingSlotId(slot.id); setEditSlot({ date: slot.date, time: slot.time }); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => deleteSlot(slot.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* All Appointments */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>All Appointments</h4>
                    {appointments.length === 0 && <p className="text-muted">No appointments.</p>}
                    {appointments.map(apt => (
                        <div key={apt.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                            {editingAppointmentId === apt.id ? (
                                <div className="d-flex gap-2 w-100">
                                    <select className="form-select" value={editAppointment.slot} onChange={e => setEditAppointment({ slot: e.target.value })}>
                                        <option value="">Select New Slot</option>
                                        {slots.filter(s => !s.is_booked).map(s => (
                                            <option key={s.id} value={s.id}>{s.doctor_name} | {s.date} {s.time}</option>
                                        ))}
                                    </select>
                                    <button className="btn btn-success btn-sm" onClick={() => updateAppointment(apt.id)}>Save</button>
                                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingAppointmentId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <span>👤 User: {apt.user} | Slot: {apt.slot} | Status: <span className="badge bg-success">{apt.status}</span></span>
                                    <div>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditingAppointmentId(apt.id); setEditAppointment({ slot: apt.slot }); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(apt.id)}>Cancel</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Patient */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>Create Patient Account</h4>
                    <form onSubmit={createPatient} className="d-flex gap-2 flex-wrap">
                        <input type="text" className="form-control" placeholder="Username" value={newPatient.username} onChange={e => setNewPatient({ ...newPatient, username: e.target.value })} />
                        <input type="email" className="form-control" placeholder="Email" value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} />
                        <input type="password" className="form-control" placeholder="Password" value={newPatient.password} onChange={e => setNewPatient({ ...newPatient, password: e.target.value })} />
                        <button type="submit" className="btn btn-success">Create</button>
                    </form>
                </div>
            </div>

            {/* Create Booking */}
            <div className="card shadow-sm mb-4">
    <div className="card-body">
        <h4>Create Booking for Patient</h4>
        <form onSubmit={createBooking} className="d-flex gap-2">
            <select
                className="form-select"
                value={newBooking.user}
                onChange={e => setNewBooking({ ...newBooking, user: e.target.value })}
            >
                <option value="">Select Patient</option>
                {users.filter(u => u.is_patient).map(u => (
                    <option key={u.id} value={u.id}>{u.username}</option>
                ))}
            </select>
            <select
                className="form-select"
                value={newBooking.slot}
                onChange={e => setNewBooking({ ...newBooking, slot: e.target.value })}
            >
                <option value="">Select Available Slot</option>
                {slots.filter(s => !s.is_booked).map(s => (
                    <option key={s.id} value={s.id}>{s.doctor_name} | {s.date} {s.time}</option>
                ))}
            </select>
            <button type="submit" className="btn btn-primary">Book</button>
        </form>
    </div>
</div>

            {/* Patient Accounts */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h4>Patient Accounts</h4>
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