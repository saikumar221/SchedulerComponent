import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isValidDate } from '@/utils/utils';
import { Schedule, CalendarEvent } from '@/app/types';

/**
 * Fetches weekly schedules for a given date range
 * @param req Request object containing start and end date parameters
 * @returns JSON response with formatted schedule data
 */
export async function GET(req: Request) {
  const supabase = await createClient();  
  const { searchParams } = new URL(req.url);
  const weekStart = searchParams.get('start');
  const weekEnd = searchParams.get('end');

  // Check if both start and end dates are provided
  if (!weekStart || !weekEnd) {
    return NextResponse.json(
      { error: 'Missing weekStart or weekEnd parameter in query.' },
      { status: 400 }
    );
  }
 
  // Validate the date format
  if (!isValidDate(weekStart) || !isValidDate(weekEnd)) {
    return NextResponse.json(
      { error: 'Invalid date format in parameters' },
      { status: 400 }
    );
  }
  
  try {
    // Call the stored procedure to fetch weekly schedules
    const { data, error } = await supabase.rpc('fetch_weekly_schedules', {
      start_date: weekStart,
      end_date: weekEnd,
    });

    if (error) {
      throw error;
    }

    const scheduledTests = data.map((schedule: Schedule) => {
      let calendarEvent: CalendarEvent = {
        title: schedule.suitename,
        startRecur: new Date(`${schedule.startdate}T${schedule.starttime}`),
        endRecur: new Date(`${schedule.enddate}T${schedule.endtime}`),  
        daysOfWeek: schedule.daysofweek,
        startTime: schedule.starttime,
        endTime: schedule.endtime,
      }; 
      if (schedule.custominterval) {
          calendarEvent['rrule'] = {
            freq: 'daily',
            interval: schedule.custominterval,
            dtstart: `${schedule.startdate}T${schedule.starttime}`,
          }
      }
      return calendarEvent;
    })
    
    // Return the fetched data as JSON
    return NextResponse.json(scheduledTests);
  } catch (error: any) {
    // Handle any errors that occur during the fetch
    console.error('Error fetching schedules:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}