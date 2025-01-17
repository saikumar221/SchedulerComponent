export interface CalendarEvent {
    title: string;
    startRecur: Date;
    endRecur: Date | null;
    daysOfWeek: number[] | null;
    startTime: string;
    endTime: string;
    rrule?: {
      freq: string;
      interval: number;
      dtstart: string;
      until?: string;
      count?: number; 
    }
}

export interface Schedule {
    scheduleid: number,
    suitename: string,
    startdate: string,
    enddate: string | null,
    daysofweek: number[] | null,
    starttime: string,
    endtime: string,
    status: string,
    frequency: string,
    custominterval: number | null,
}

export interface NewScheduleRecord {
  suiteID: number;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime?: string;
  status?: 'active' | 'paused' | 'cancelled';
  frequency: 'Daily' | 'Weekly' | 'Custom';
  customInterval?: number;
  daysOfWeek?: number[];
}

export interface Suite {
    suiteid: string;
    suitename: string;
  }