import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [newDoctor, setNewDoctor] = useState({ name: '', specialty: '' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/doctors/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setDoctors(res.data));

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

    const cancelAppointment = async (id) => {
        try {
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
                    <p>{doctor.name} - {doctor.specialty}</p>
                    <button onClick={() => deleteDoctor(doctor.id)}>Delete</button>
                </div>
            ))}

            <h3>All Appointments</h3>
            {appointments.map(appointment => (
                <div key={appointment.id}>
                    <p>Appointment ID: {appointment.id} | Status: {appointment.status}</p>
                    <button onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;