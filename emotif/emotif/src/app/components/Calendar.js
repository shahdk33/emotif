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
import { connectFirebase, getEvents } from '../../../backend/firebase.js'; // Import Firebase functions

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]); // State to store events

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 0 }); // Week starts on Sunday
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

  const daysOfWeek = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });
  const hoursInDay = eachHourOfInterval({
    start: setMinutes(setHours(new Date(), 0), 0),
    end: setMinutes(setHours(new Date(), 23), 59),
  });

  // Fetch events from Firebase when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const [db, dbRef] = connectFirebase(); // Initialize Firebase
      try {
        const eventsData = await getEvents(dbRef); // Get events from Firebase
        console.log('Fetched Events:', eventsData); // Log events in console
        if (eventsData !== "No data available") {
          const parsedEvents = JSON.parse(eventsData); // Parse the events data
          setEvents(parsedEvents); // Update state with events
        }
      } catch (error) {
        console.error('Error fetching events:', error); // Handle errors
      }
    };

    fetchEvents();
  }, [currentDate]); // Re-fetch events when currentDate changes

  // Helper function to check if an event falls within a specific time slot
  const getEventForTimeSlot = (eventDate, hour) => {
    const eventStart = new Date(eventDate.starttime); // Assume starttime is a valid timestamp
    const eventEnd = new Date(eventDate.endtime); // Assume endtime is a valid timestamp

    return (
      eventStart.getHours() <= hour.getHours() &&
      eventEnd.getHours() > hour.getHours() &&
      format(eventStart, 'yyyy-MM-dd') === format(eventDate.date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(addWeeks(currentDate, -1))}
          className="text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          &larr; Previous Week
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
          className="text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
        >
          Next Week &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 border border-gray-300">
        {/* Header Row */}
        <div className="bg-gray-200 p-2 text-center font-bold text-gray-800 border-r border-gray-300">
          Time
        </div>
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="bg-gray-200 p-2 text-center font-bold text-gray-800 border-r border-gray-300"
          >
            {format(day, 'EEE')} <br />
            <span className="text-sm font-normal">{format(day, 'MMM d')}</span>
          </div>
        ))}

        {/* Time Slots */}
        {hoursInDay.map((hour, hourIndex) => (
          <React.Fragment key={hourIndex}>
            <div className="bg-white p-2 text-right font-medium text-gray-600 border-t border-gray-300">
              {format(hour, 'h a')}
            </div>
            {daysOfWeek.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="bg-white p-2 border-t border-r border-gray-300 hover:bg-gray-100 cursor-pointer"
              >
                {/* Render events in the appropriate time slot */}
                {/* {events
                  .filter(event =>
                    getEventForTimeSlot(event, hour) &&
                    format(day, 'yyyy-MM-dd') === format(event.date, 'yyyy-MM-dd')
                  )
                  .map((event, eventIndex) => (
                    <div key={eventIndex} className="text-xs text-blue-600 font-semibold">
                      {event.name} ({format(new Date(event.starttime), 'h:mm a')})
                    </div>
                  ))} */}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
