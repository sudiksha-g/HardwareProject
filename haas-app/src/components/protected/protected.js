import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Protected = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:5000/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.logged_in_as.username);
      } catch (error) {
        console.error("Error fetching protected data", error);
        setError("Failed to fetch protected data");
      }
    };
    
    fetchProtectedData();
  }, []);

  return (
    <div>
      <h1>Protected Route</h1>
      {message && <p>Welcome, {message}!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Protected;