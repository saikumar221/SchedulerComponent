import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import rrulePlugin from '@fullcalendar/rrule';


export default function CalendarPage() {
          return (
            <div className='calendar-container'>
                <FullCalendar
                        plugins={[timeGridPlugin, rrulePlugin]}
                        initialView="timeGridWeek"
                        events='/api/schedules'
                        height="auto"
                        eventColor="#E5EAFB"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridWeek'
                    }}
                    nowIndicator={true}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    defaultTimedEventDuration="00:30"
                />
            </div>
    )
}
