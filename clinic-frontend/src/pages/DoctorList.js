import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/doctors/', {
            headers: { Authorization: `Token ${token}` }
        })
        .then(res => setDoctors(res.data))
        .catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h2>Available Doctors</h2>
            {doctors.map(doctor => (
                <div key={doctor.id}>
                    <h3>{doctor.name}</h3>
                    <p>Specialty: {doctor.specialty}</p>
                    <a href={`/appointments?doctor=${doctor.id}`}>Book Appointment</a>
                </div>
            ))}
        </div>
    );
}

export default DoctorList;