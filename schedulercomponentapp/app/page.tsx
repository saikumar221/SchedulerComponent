'use client';

import { useState, useEffect } from 'react';
import CalendarPage from './components/Calendar';


export default function SchedulesPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Scheduler</h1>
      <CalendarPage />
    </div>
  );
}