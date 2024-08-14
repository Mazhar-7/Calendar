import React, { useEffect, useState } from "react";
import "./CalendarApp.css";

const CalendarApp = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "Faburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDate = new Date();
// Initial State of Calendar from Local storage

const getInitialEvents = () => {
  const event = localStorage.getItem("events");
  const parsedEvent = event ? JSON.parse(event) : [];

  if (Array.isArray(parsedEvent)) {
    return parsedEvent.map(event => ({
      ...event,
      date: new Date(event.date),
    }));
  } else {
    // If parsedEvent is not an array, return a default empty array or a default set of events
    return [];
  }
};



  // States
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [showEventPopup, setShowEventPopup] = useState(false);
  // States for Event List
  const [events, setEvents] = useState(getInitialEvents);
  const [eventTime, setEventTime] = useState({ hours: "00", minutes: "00" });
  const [eventText, setEventText] = useState("");
  // States for Editing Events
  const [editingEvent, setEditingEvent] = useState(null);
  // State show warnign message
  const [warning, setWarning] = useState(false);




  // UseEffect 
  
  useEffect(()=>{
    localStorage.setItem("events", JSON.stringify(events));
  },[events]);



  // Logic for getting Days in month and first day
  const dayInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // Buttons logics for Navigations

  // Prev
  const prevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear((prevYear) =>
      currentMonth === 0 ? prevYear - 1 : prevYear
    );
  };
  // Next
  const nextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear((prevYear) =>
      currentMonth === 11 ? prevYear + 1 : prevYear
    );
  };

  // Handle Day Click
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();
    // To make Event popup display
    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
      setEventTime({ hours: "00", minutes: "00" });
      setEventText("");
      setEditingEvent(null);
    }
  };
  // Same Day checks
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Handle Event Submit
  const handleEventSubmit = () => {
    const newEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate,
      time: `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(
        2,
        "0"
      )}`,
      text: eventText,
    };
    // Editing Events
    let updatedEvents = [...events];
    if (editingEvent) {
      updatedEvents = updatedEvents.map((event) =>
        event.id === editingEvent.id ? newEvent : event
      );
    } else {
      updatedEvents.push(newEvent);
    }
    updatedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(updatedEvents);
    setEventTime({ hours: "00", minutes: "00" });
    setEventText("");
    setShowEventPopup(false);
    setEditingEvent(null);
  };
  // handle Edit Event
  const handleEditing = (event) => {
    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setEventText(event.text);
    setEditingEvent(event);
    setShowEventPopup(true);
  };
  // handle Delete Event
  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  // handle Time Format

  const handleTimeChange = (e) => {
    const { name, value } = e.target;

    const hoursPattern = /^(0|[1-9]|1[0-9]|2[0-4])$/;
    const minutesPattern = /^(0|[1-9]|[1-5][0-9])$/;

    // Remove leading zeros by converting to a number and back to string
    const numericValue = String(parseInt(value, 10));

    if (name === "hours") {
      if (hoursPattern.test(numericValue)) {
        const paddedValue = numericValue.padStart(2, "0");
        setEventTime((prevTime) => ({
          ...prevTime,
          hours: paddedValue,
        }));
      } else {
        setWarning(true);
      }
    }

    if (name === "minutes") {
      if (minutesPattern.test(numericValue)) {
        const paddedValue = numericValue.padStart(2, "0");
        setEventTime((prevTime) => ({
          ...prevTime,
          minutes: paddedValue,
        }));
      } else {
        setWarning(true);
      }
    }
  };

  // Update the state
  // setEventTime((prevTime) => ({
  //   ...prevTime,
  //   [name]: value.padStart(2, "0"),
  // }));

  return (
    <>
      <div className="calendar-app">
        <div className="calendar">
          <h1 className="heading">Calendar</h1>
          <div className="navigate-date">
            <h2 className="month">{monthsOfYear[currentMonth]},</h2>
            <h2 className="year">{currentYear}</h2>
            <div className="buttons">
              <i class="fa-solid fa-caret-left" onClick={prevMonth}></i>
              <i class="fa-solid fa-caret-right" onClick={nextMonth}></i>
            </div>
          </div>
          <div className="weekdays">
            {daysOfWeek.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="days">
            {[...Array(firstDayOfMonth).keys()].map((_, index) => (
              <span key={`empty-${index}`} />
            ))}
            {[...Array(dayInMonth).keys()].map((day) => (
              <span
                className={
                  day + 1 === currentDate.getDate() &&
                  currentMonth === currentDate.getMonth() &&
                  currentYear === currentDate.getFullYear()
                    ? "current-date"
                    : ""
                }
                onClick={() => handleDayClick(day + 1)}
                key={day + 1}
              >
                {" "}
                {day + 1}
              </span>
            ))}
          </div>
        </div>
        <div className="events">
          {showEventPopup && (
            <div className="event-popup">
              <div className="time-input">
                <div className="event-popup-time">TIME</div>
                <input
                  type="number"
                  name="hours"
                  step={1}
                  min={0}
                  max={24}
                  value={eventTime.hours}
                  className="hours"
                  placeholder="00"
                  onChange={handleTimeChange}
                />
                <input
                  type="number"
                  name="minutes"
                  step={1}
                  min={0}
                  max={60}
                  value={eventTime.minutes}
                  className="minutes"
                  placeholder="00"
                  onChange={handleTimeChange}
                />
              </div>
              <textarea
                placeholder="Enter Event Text (Maximum 60 characters)"
                value={eventText}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setEventText(e.target.value);
                  }
                }}
              ></textarea>
              <button className="event-popup-btn" onClick={handleEventSubmit}>
                {editingEvent ? "Update Event" : "Add Event"}
              </button>
              <button
                className="close-event-popup"
                onClick={() => setShowEventPopup(false)}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}

          <div className={`alert ${warning ? "show" : "hide"}`}>
            <div className="alert-warn">
              <span>
                <i class="fa-solid fa-triangle-exclamation"></i>
              </span>
            </div>
            <span className="alert-text">Please Enter correct Fomrat</span>
            <div className="alert-close">
              <span>
                <i
                  class="fa-solid fa-xmark"
                  onClick={() => setWarning(false)}
                ></i>
              </span>
            </div>
          </div>

          {events.map((event, index) => (
            <div className="event" key={index}>
              <div className="event-date-wrapper">
                <div className="event-date">{`${
                  monthsOfYear[event.date.getMonth()]
                } ${event.date.getDate()}, ${event.date.getFullYear()}`}</div>
                <div className="event-time">{event.time}</div>
              </div>
              <div className="event-text">{event.text}</div>
              <div className="event-buttons">
                <i
                  class="fa-regular fa-pen-to-square"
                  onClick={() => handleEditing(event)}
                ></i>
                <i
                  class="fa-solid fa-trash"
                  onClick={() => handleDeleteEvent(event.id)}
                ></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CalendarApp;



  // Get Initial state from local storage 

  // const getInitialEvents = ()=>{
  //   const event = localStorage.getItem("events");
  //   return event ?JSON.parse(event) : events;
  // }

  // getInitialEvents