
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
import { connectFirebase, getEvents, getAievents,addEvents, removeAievent } from '../../../backend/firebase.js';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [aievents, setAIEvents] = useState([]);
  const [db, dbRef] = connectFirebase();

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

  useEffect(() => {
    const fetchAIEvents = async () => {
      const [db, dbRef] = connectFirebase();
      try {
        const eventsData = await getAievents(dbRef);
        if (eventsData !== "No data available") {
          const parsedEvents = JSON.parse(eventsData).filter(event => event !== null);
          setAIEvents(parsedEvents);
          // console.log(parsedEvents);
        }
      } catch (error) {
        console.error('Error fetching ai events:', error);
      }
    };

    fetchAIEvents();
  });


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
  const endsthishour = (event, hour)=>{
    // Check if the event starts within the current hour
    const eventEndTime = setMinutes(setHours(new Date(), ...event.endtime.split(':').map(Number)), 0);
    // Create a date object for the hour being checked
    const currentHourStart = setMinutes(setHours(new Date(), hour), 0);
    const currentHourEnd = setMinutes(setHours(new Date(), hour), 59);
    const isWithinLastHour = eventEndTime <= currentHourEnd && eventEndTime >= currentHourStart;
    return isWithinLastHour;
};
  const addToCaldender = (event, hour)=>{
  // Check if the event starts within the current hour
  const eventEndTime = setMinutes(setHours(new Date(), ...event.endtime.split(':').map(Number)), 0);
  // Create a date object for the hour being checked
  const currentHourStart = setMinutes(setHours(new Date(), hour), 0);
  const currentHourEnd = setMinutes(setHours(new Date(), hour), 59);
  const isWithinLastHour = eventEndTime <= currentHourEnd && eventEndTime >= currentHourStart;
  return isWithinLastHour;
};


  return (
    <div className="bg-white rounded-lg shadow-md m-4 pb-10">
      <header className="flex items-center p-4">
        <img src="/emoji/logo-transparent.png" alt="Logo" className="h-12 w-auto" />
        <h1 className="ml-4 text-2xl font-semibold text-gray-700">Teams Calendar</h1>
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
{events
  .filter(event => format(parseDate(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
  .map((event, k) => {
    const startHour = parseInt(event.starttime.split(':')[0], 10);
    const endHour = parseInt(event.endtime.split(':')[0], 10);
    const duration = endHour - startHour + 1; // Number of time slots to span

    if (hour.getHours() === startHour) {
      return (
        <div
          key={k}
          className={`absolute z-[1000] left-0 w-full bg-purple-200 text-purple-800 p-2 shadow-lg border-l-4 border-purple-800 mt-[-8px]`}
          style={{
            height: `${duration * 100}%`,
          }}
        >
          <span className="font-semibold">{event.name}</span>
        </div>
      );
    }
    return null; // Prevent rendering multiple separate blocks
  })}

                  {aievents.filter(event => format(parseDate(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd') && getEventForTimeSlot(event, hour.getHours()))
                  .map((event, k) => (
<div key={k} className="absolute inset-0 bg-pink-100 text-pink-400 p-[5px] shadow-lg border-l-4 border-pink-400 text-[12px] whitespace-normal break-words min-h-[50px]">
{startsthishour(event, hour.getHours()) && (
                          <span className="font-semibold">✦{event.name}</span>
                      )}
                      {startsthishour(event, hour.getHours()) && (
                        <span className="mb-5 bg-white-200"></span>
                      )}
                      {
                        endsthishour(event,hour.getHours()) &&(<button
                          className="ml-2 px-2 py-1 bg-pink-400 text-white rounded shadow"
                          onClick={() =>{
                            addEvents(db,{
                              date: event.date,
                              starttime: event.starttime,
                              endtime: event.endtime,
                              name: event.name,
                            });
                            removeAievent(db, event.name,event.date,event.starttime, event.endtime)
                          }
                        }
                        >
                          Add to Calendar
                        </button>)
                      }
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
