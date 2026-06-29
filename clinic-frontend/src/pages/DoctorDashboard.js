import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DoctorDashboard (){
    const [appointments, setAppointments] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get('https://7420-s1-assignment2.vercel.app/doctor_appointment/', {
            headers: { Authorization: `Token ${token}` }
        }).then(res => setAppointments(res.data));

    }, []);
return (
        <div>
            <h2>My Patient Appointments</h2>
            {appointments.map(apt => (
                <div key={apt.id} className="card mb-3">
                    <div className="card-body">
                        <p>Slot: {apt.slot}</p>
                        <p>Status: {apt.status}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
export default DoctorDashboard;
