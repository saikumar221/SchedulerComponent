'use client';

import { useState, useEffect } from 'react';
import { Schedule } from './types';


export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSchedules() {
      setLoading(true);
      setError(null);

      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString().split('T')[0];
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6)).toISOString().split('T')[0];

      try {
        const response = await fetch(`/api/schedules?start=${startOfWeek}&end=${endOfWeek}`);
        const data = await response.json();

        if (response.ok) {
          setSchedules(data);
        } else {
          setError(data.error || 'Failed to fetch schedules.');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Schedules for This Week</h1>
      {schedules.length === 0 ? (
        <p>No schedules found for this week.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((schedule) => (
            <div key={schedule.title} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-bold">{schedule.title}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}