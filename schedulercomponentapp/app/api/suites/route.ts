import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Fetches available suites
 * @returns JSON response which has available suites
 */
export async function GET(req: Request) {
  const supabase = await createClient();  
  
  try {
    // Call the stored procedure to fetch weekly schedules
    const { data, error } = await supabase.from("testsuites").select();
    if (error) {
      throw error;
    }    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching suites:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}