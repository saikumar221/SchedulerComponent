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