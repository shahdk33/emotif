// 'use client';
// import React, { useState, useEffect } from 'react';
// import {
//   format,
//   addWeeks,
//   startOfWeek,
//   endOfWeek,
//   eachDayOfInterval,
//   eachHourOfInterval,
//   setHours,
//   setMinutes,
// } from 'date-fns';
// import { connectFirebase, getEvents } from '../../../backend/firebase.js'; // Import Firebase functions

// const Calendar = () => {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [events, setEvents] = useState([]); // State to store events

//   const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // Week starts on Sunday
//   const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

//   const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });
//   const hoursInDay = eachHourOfInterval({
//     start: setMinutes(setHours(new Date(), 8), 0),
//     end: setMinutes(setHours(new Date(), 23), 59),
//   });

//   // Fetch events from Firebase when the component mounts
//   useEffect(() => {
//     const fetchEvents = async () => {
//       const [db, dbRef] = connectFirebase(); // Initialize Firebase
//       try {
//         const eventsData = await getEvents(dbRef); // Get events from Firebase
//         console.log('Fetched Events:', eventsData); // Log events in console
//         if (eventsData !== "No data available") {
//           const parsedEvents = JSON.parse(eventsData); // Parse the events data
//           // Filter out any null events before setting state
//           const validEvents = parsedEvents.filter(event => event !== null);
//           setEvents(validEvents); // Update state with valid events
//         }
//       } catch (error) {
//         console.error('Error fetching events:', error); // Handle errors
//       }
//     };

//     fetchEvents();
//   }, [currentDate]); // Re-fetch events when currentDate changes

//   // Helper function to convert 'DD-MM-YYYY' format into a Date object
//   const parseDate = (dateString) => {
//     const [day, month, year] = dateString.split('-');
//     return new Date(`${month}-${day}-${year}`);
//   };

//   // Helper function to check if an event falls within a specific time slot
//   const getEventForTimeSlot = (eventDate, hour) => {
//     const eventStart = eventDate.starttime;
//     const eventEnd = eventDate.endtime;

//     const [eventStartHour, eventStartMinute] = eventStart.split(':').map(num => parseInt(num));
//     const [eventEndHour, eventEndMinute] = eventEnd.split(':').map(num => parseInt(num));
//     const hourStart = setHours(setMinutes(new Date(), 0), hour); // Start of the hour
//     const hourEnd = setHours(setMinutes(new Date(), 59), hour); // End of the hour

//     // Convert event start and end to date objects
//     const eventStartTime = setMinutes(setHours(new Date(), eventStartHour), eventStartMinute);
//     const eventEndTime = setMinutes(setHours(new Date(), eventEndHour), eventEndMinute);

//     // Check if the event is within the current hour slot
//     return (eventStartTime < hourEnd && eventEndTime > hourStart);
//   };

//   return (
//     <div className="bg-gray-100 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
//           className="text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
//         >
//           &larr; Previous Week
//         </button>
//         <h2 className="text-xl font-semibold text-gray-800">
//           {format(currentDate, 'MMMM yyyy')}
//         </h2>
//         <button
//           onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
//           className="text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
//         >
//           Next Week &rarr;
//         </button>
//       </div>

//       {/* Calendar Grid */}
//       <div className="grid grid-cols-8 border border-gray-300">
//         {/* Header Row */}
//         <div className="bg-gray-200 p-2 text-center font-bold text-gray-800 border-r border-gray-300">
//           Time
//         </div>
//         {daysOfWeek.map((day, index) => (
//           <div
//             key={index}
//             className="bg-gray-200 p-2 text-center font-bold text-gray-800 border-r border-gray-300"
//           >
//             {format(day, 'EEE')} <br />
//             <span className="text-sm font-normal">{format(day, 'MMM d')}</span>
//           </div>
//         ))}

//         {/* Time Slots */}
//         {hoursInDay.map((hour, hourIndex) => (
//           <React.Fragment key={hourIndex}>
//             <div className="bg-white p-2 text-right font-medium text-gray-600 border-t border-gray-300">
//               {format(hour, 'h a')}
//             </div>
//             {daysOfWeek.map((day, dayIndex) => (
//               <div
//                 key={dayIndex}
//                 className="bg-white p-2 border-t border-r border-gray-300 hover:bg-gray-100 cursor-pointer"
//               >
//                 {/* Render events in the appropriate time slot */}
//                 {events
//                   .filter(event => {
//                     const eventDate = parseDate(event.date); // Convert event.date string to Date object
//                     return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') &&
//                       getEventForTimeSlot(event, hour.getHours()); // Check if event is in current hour
//                   })
//                   .map((event, eventIndex) => (
//                     <div key={eventIndex} className="text-sm font-semibold text-blue-500">
//                       {event.name}
//                       <div className="text-xs text-gray-500">
//                         {event.starttime} - {event.endtime}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             ))}
//           </React.Fragment>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Calendar;

'use client';
import React, { useState, useEffect } from 'react';
import {
  format,
  addWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  setHours,
  setMinutes,
} from 'date-fns';
import { connectFirebase, getEvents } from '../../../backend/firebase.js';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

  const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });
  const hoursInDay = eachHourOfInterval({
    start: setMinutes(setHours(new Date(), 8), 0),
    end: setMinutes(setHours(new Date(), 23), 59),
  });

  useEffect(() => {
    const fetchEvents = async () => {
      const [db, dbRef] = connectFirebase();
      try {
        const eventsData = await getEvents(dbRef);
        if (eventsData !== "No data available") {
          const parsedEvents = JSON.parse(eventsData).filter(event => event !== null);
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentDate]);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(`${month}-${day}-${year}`);
  };

  const getEventForTimeSlot = (event, hour) => {
    const eventStartTime = setMinutes(setHours(new Date(), ...event.starttime.split(':').map(Number)), 0);
    const eventEndTime = setMinutes(setHours(new Date(), ...event.endtime.split(':').map(Number)), 59);
    return eventStartTime < setHours(setMinutes(new Date(), 59), hour) && eventEndTime > setHours(setMinutes(new Date(), 0), hour);
  };

  const startsthishour = (event, hour)=>{
      // Check if the event starts within the current hour
      const eventStartTime = setMinutes(setHours(new Date(), ...event.starttime.split(':').map(Number)), 0);
      // Create a date object for the hour being checked
      const currentHourStart = setMinutes(setHours(new Date(), hour), 0);
      const currentHourEnd = setMinutes(setHours(new Date(), hour), 59);
      const isWithinFirstHour = eventStartTime <= currentHourEnd && eventStartTime >= currentHourStart;
      return isWithinFirstHour;
  };

  const endsthishour = (event, hour) => {
    // Check if the event ends within the current hour
    const eventEndTime = setMinutes(setHours(new Date(), ...event.endtime.split(':').map(Number)), 59);
    // Create a date object for the hour being checked
    const currentHourStart = setMinutes(setHours(new Date(), hour), 0);
    const currentHourEnd = setMinutes(setHours(new Date(), hour), 59);
    const isWithinEndHour = eventEndTime <= currentHourEnd && eventEndTime >= currentHourStart;
    return isWithinEndHour;
};


  return (
    <div className="bg-white rounded-lg shadow-md">
      <header className="flex items-center p-4">
        <img src="/emoji/logo.jpg" alt="Logo" className="h-12 w-auto" />
        <h1 className="ml-4 text-2xl font-semibold text-gray-700">Emotif Calendar</h1>
        <div className="flex-grow" />
        <button className="px-4 py-2 mx-5 bg-white-600 text-gray-600 rounded-md border">Meet Now</button>
        <button className="px-4 py-2 bg-purple-900 text-white rounded-md hover:bg-purple-800">+ New Meeting</button>
      </header>
      <div className="flex gap-2 justify-left items-center border">
      <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-gray-600 font-medium rounded-md hover:text-purple-800">Today</button>
        <button onClick={() => setCurrentDate(addWeeks(currentDate, -1))} className="px-4 py-2 rounded-lg bg-white-200 text-gray-700 transform scale-y-150"><span className="text-3xl hover:text-purple-900">&lt;</span></button>
        <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="px-4 py-2 rounded-lg bg-white-200 text-gray-700 transform scale-y-150"><span className="text-3xl hover:text-purple-900">&gt;</span></button>
        <h2 className="px-2 text-l font-semibold text-gray-700">{format(currentDate, 'MMMM yyyy')}</h2>
        </div>

      <div className="grid grid-cols-[100px_repeat(7,1fr)] border">
        <div className="font-bold border text-center"></div>
        {daysOfWeek.map((day, i) => (
          <div key={i} className=" text-center border text-gray-500 text-3xl">
            {format(day, 'dd')}
            <div key={i} className=" p-3 text-center text-gray-500 text-sm">
            {format(day, 'EEEE')}
          </div>
          </div>

        ))}

        {hoursInDay.map((hour, i) => (
          <React.Fragment key={i}>
            <div className="p-2 text-right font-medium text-gray-500 w-16 text-sm">{format(hour, 'h a')}</div>
            {daysOfWeek.map((day, j) => (
              <div key={j} className="relative p-2 border bg-white hover:bg-blue-50">
                {events.filter(event => format(parseDate(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && getEventForTimeSlot(event, hour.getHours()))
                  .map((event, k) => (
                    <div key={k} className="absolute inset-0 bg-purple-200 text-purple-800 p-2 shadow-lg border-l-4 border-purple-800">
                      {startsthishour(event, hour.getHours()) && (
                          <span className="font-semibold">{event.name}</span>
                      )}
                      {startsthishour(event, hour.getHours()) && (
                        <span className="mb-5 bg-white-200"></span>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
