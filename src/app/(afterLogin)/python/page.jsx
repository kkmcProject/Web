"use client";

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [message, setMessage] = useState('');

  const fetchMessage = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/python`, {
        method: 'POST', // use POST method
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching Python script output:', error);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className='mt-96'>
      <h1>Message from Python script:</h1>
      <p>{message}</p>
    </div>
  );
}
