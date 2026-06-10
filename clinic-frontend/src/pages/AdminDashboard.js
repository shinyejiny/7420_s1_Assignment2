import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [slots, setSlots] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const [newSlot, setNewSlot] = useState({ doctor: '', date: '', time: '' });
    const [users, setUsers] = useState([]);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [editDoctor, setEditDoctor] = useState({ name: '', specialty: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/doctors/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setDoctors(res.data));

        axios.get('http://127.0.0.1:8000/slots_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setSlots(res.data));

        axios.get('http://127.0.0.1:8000/users_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setUsers(res.data));

        axios.get('http://127.0.0.1:8000/appointments_router/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setAppointments(res.data));
    }, []);

    const addDoctor = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://127.0.0.1:8000/doctors/create/', newDoctor, {
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
            await axios.delete(`http://127.0.0.1:8000/doctors_router/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setDoctors(doctors.filter(d => d.id !== id));
        } catch (err) {
            console.log(err);
        }
    };
    const updateDoctor = async (id) => {
    try {
        await axios.put(`http://127.0.0.1:8000/doctors/${id}/update/`, editDoctor, {
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
            const res = await axios.post('http://127.0.0.1:8000/slots_router/', {
                ...newSlot,
                is_booked: false
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            setSlots([...slots, res.data]);
            setNewSlot({ doctor: '', date: '', time: '' });
        } catch (err) {
            console.log(err);
        }
    };

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

    const deleteSlot = async (id) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/slots_router/${id}/`, {
            headers: { Authorization: `Token ${token}` }
        });
        setSlots(slots.filter(s => s.id !== id));
    } catch (err) {
        console.log(err);
    }
};

    const deleteUser = async (id) => {
    try {
        await axios.delete(`http://127.0.0.1:8000/users_router/${id}/`, {
            headers: { Authorization: `Token ${token}` }
        });
        setUsers(users.filter(u => u.id !== id));
    } catch (err) {
        console.log(err);
    }
};

    return (
        <div>
            <h2>Admin Dashboard</h2>

            <h3>Add Doctor</h3>
            <form onSubmit={addDoctor}>
                <input
                    type="text"
                    placeholder="Doctor Name"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Specialty"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                />
                <button type="submit">Add Doctor</button>
            </form>
            <h3>Doctors</h3>
            {doctors.map(doctor => (
            <div key={doctor.id}>
                {editingDoctorId === doctor.id ? (
            <div>
                <input
                    type="text"
                    value={editDoctor.name}
                    onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                />
                <input
                    type="text"
                    value={editDoctor.specialty}
                    onChange={(e) => setEditDoctor({ ...editDoctor, specialty: e.target.value })}
                />
                <button onClick={() => updateDoctor(doctor.id)}>Save</button>
                <button onClick={() => setEditingDoctorId(null)}>Cancel</button>
            </div>
        ) : (
            <div>
                <p>{doctor.name} - {doctor.specialty}</p>
                <button onClick={() => { setEditingDoctorId(doctor.id); setEditDoctor({ name: doctor.name, specialty: doctor.specialty }); }}>Edit</button>
                <button onClick={() => deleteDoctor(doctor.id)}>Delete</button>
            </div>
        )}
    </div>
))}
            <h3>All Slots</h3>
            {slots.map(slot => (
                <div key={slot.id}>
                    <p>Date: {slot.date} | Time: {slot.time} | Booked: {slot.is_booked ? 'Yes' : 'No'}</p>
                    <button onClick={() => deleteSlot(slot.id)}>Delete</button>
                </div>
            ))}
            <h3>Patient Accounts</h3>
            {users.filter(u => u.is_patient).map(user => (
                <div key={user.id}>
                    <p>{user.username} - {user.email}</p>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;