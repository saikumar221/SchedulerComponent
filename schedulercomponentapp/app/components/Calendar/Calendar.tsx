import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import rrulePlugin from "@fullcalendar/rrule";
import "./Calendar.css";

export default function CalendarPage() {
  const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <FullCalendar
      plugins={[listPlugin, timeGridPlugin, rrulePlugin]}
      initialView="timeGridWeek"
      events="/api/schedules"
      height="100%"
      eventColor="#E5EAFB"
      eventBorderColor="#0435DD80"
      eventTextColor="#0435DD"
      displayEventTime={true}
      displayEventEnd={false}
      themeSystem="standard"
      eventContent={function (arg) {
        const startDate = new Date(arg.event.startStr);
        const formattedTime = startDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: browserTimeZone,
          timeZoneName: "short",
        });

        return (
          <div className="event-content">
            <div>
              <div>{arg.event.title}</div>
              <div className="time">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="icon-size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <div>{formattedTime}</div>
              </div>
            </div>
          </div>
        );
      }}
      eventTimeFormat={{
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }}
      customButtons={{
        myCustomButton: {
          text: "Schedule Test",
          icon: "plus",
          click: function () {
            alert("clicked the custom button!");
          },
        },
      }}
      headerToolbar={{
        left: "prev title next",
        center: "",
        right: "timeGridWeek listWeek",
      }}
      titleFormat={{ month: "long", day: "numeric", year: "numeric" }}
      views={{
        timeGridWeek: {
          titleFormat: ({ date }) => {
            return `Week of ${new Date(date.marker).toLocaleDateString(
              "en-US",
              {
                month: "2-digit",
                day: "2-digit",
                year: "2-digit",
              }
            )}`;
          },
        },
      }}
      nowIndicator={false}
      // editable={true}
      // selectable={true}
      // selectMirror={true}
      slotEventOverlap={true}
      allDaySlot={false}
      eventMaxStack={2}
      lazyFetching={true}
      loading={function (isLoading) {}}
      eventClick={function (eventClickInfo) {
        alert("Event: " + eventClickInfo.event.title);
        alert(
          "Coordinates: " +
            eventClickInfo.jsEvent.pageX +
            "," +
            eventClickInfo.jsEvent.pageY
        );
        alert("View: " + eventClickInfo.view.type);

        eventClickInfo.el.style.borderColor = "red";
      }}
      // slotLabelFormat={function(inputObject) {
      //   console.log(inputObject)
      //   const markerDate = new Date(inputObject.date.marker);
      //   return markerDate.toLocaleTimeString('en', { hour: 'numeric', hour12: true })
      // }}
      dayHeaderFormat={function (inputObject) {
        const markerDate = new Date(inputObject.date.marker);
        const dayName = markerDate.toLocaleDateString("en", {
          weekday: "short",
        });
        return `${markerDate.getDate()} ${dayName}`;
      }}
    />
  );
}
