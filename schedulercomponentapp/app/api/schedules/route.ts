import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { convertUTCToTimezone, isValidDate, isValidScheduleData as isValidSchedule } from '@/utils/utils';
import { Schedule, CalendarEvent, NewScheduleRecord } from '@/app/types';

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
  const desiredTimeZone = searchParams.get('browserTimeZone') || 'UTC';

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
      if ((schedule.custominterval === null || schedule.custominterval === 0) && (!schedule.daysofweek || schedule.daysofweek.length === 0)) {
        return {
          title: schedule.suitename,
          start: `${schedule.startdate}T${schedule.starttime}Z`, // UTC time
          end: schedule.enddate?`${schedule.enddate}T${schedule.endtime}Z`:null, // UTC time
          }
      }
      if (schedule.custominterval) {
        return {
          title: schedule.suitename,
          startRecur: `${schedule.startdate}T${schedule.starttime}Z`, // UTC time
          endRecur: schedule.enddate?`${schedule.enddate}T${schedule.endtime}Z`:null, // UTC time
          rrule: {
            freq: 'daily',
            interval: schedule.custominterval,
            dtstart: `${schedule.startdate}T${schedule.starttime}Z`, // UTC time
          }
        }
      }
      else{
        const endTime = new Date(`${schedule.enddate}T${schedule.endtime}Z`);
        const convertedstartTime: string = convertUTCToTimezone(`${schedule.startdate}T${schedule.starttime}Z`, desiredTimeZone);
        const dateObject: Date = new Date(convertedstartTime);
        const timeOnly: string = dateObject.toLocaleTimeString('en-US', { hour12: false });

        return {
          title: schedule.suitename,
          startRecur: `${schedule.startdate}T${schedule.starttime}Z`, // UTC time
          endRecur: schedule.enddate?`${schedule.enddate}T${schedule.endtime}Z`:null, // UTC time
          daysOfWeek: schedule.daysofweek,
          startTime: timeOnly,
          endTime: endTime,
          }
      }
    })
    
    // Return the fetched data as JSON
    return NextResponse.json(scheduledTests);
  } catch (error: any) {
    // Handle any errors that occur during the fetch
    console.error('Error fetching schedules:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Inserts a new schedule into the schedules table
 * @param req Request object containing schedule data
 * @returns JSON response with the result of the insertion
 */
export async function POST(req: Request) {
  const scheduleData: NewScheduleRecord = await req.json();
  // Validate the schedule data
  if (!isValidSchedule(scheduleData)) {
    return NextResponse.json(
      { error: 'Invalid date format in schedule data' },
      { status: 400 }
    );
  }
  try {
    // Insert the schedule into the database
    const response = insertSchedule(scheduleData);
    console.log('Inserted schedule2:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error inserting schedule2:', error);
    throw error;
  }
}

async function insertSchedule(scheduleData: NewScheduleRecord) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('schedules')
      .insert({
          suiteid: scheduleData.suiteID,
          startdate: scheduleData.startDate,
          starttime: scheduleData.startTime,
          status: scheduleData.status || 'active',
          enddate: scheduleData.endDate || null,
          endtime: scheduleData.endTime || null,
          frequency: scheduleData.frequency,
          custominterval: scheduleData.customInterval || null,
          daysofweek: scheduleData.daysOfWeek || null
        })
    console.log('Succes Inserted schedule:', data, error)
    if (error) {
      console.log('Error Inserted schedule:', data, error)
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error inserting schedule3:', error);
    throw error;
  }
}