import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isValidDate } from '@/utils/utils';

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

    // Return the fetched data as JSON
    return NextResponse.json(data);
  } catch (error: any) {
    // Handle any errors that occur during the fetch
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}