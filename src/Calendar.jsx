import { useState, useContext } from "react";
import toast from "react-hot-toast";

import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import { eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from "date-fns";

import { GlobalContext } from "./Provider";

const EventCalendar = () => {
  let currentDate = new Date();

  // For Displaying Dialog Boxes
  const [visible, setVisible] = useState(false);
  const [eventVisible, setEventVisible] = useState(false);

  const { events, setEvents } = useContext(GlobalContext);

  // For Adding New Events
  const [title, setTitle] = useState('');
  const [selected_date, setSelected_date] = useState({
    "index": "",
    "date": ""
  });
  const [time, setTime] = useState({
    "from": "",
    "to": ""
  });
  const [selectedTag, setSelectedTag] = useState('');
  const tags = [
    { name: "Work", code: "tag1" },
    { name: "Personal", code: "tag2" },
    { name: "Appointment", code: "tag3" },
    { name: "Meeting", code: "tag4" },
    { name: "Deadline", code: "tag5" },
    { name: "Holiday", code: "tag6" },
    { name: "Travel", code: "tag7" },
    { name: "Birthday", code: "tag8" },
    { name: "Anniversary", code: "tag9" },
  ]

  // For Displaying Events
  const [selectedEvent, setSelectedEvent] = useState();
  const [disable, setDisable] = useState(true);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !time.from || !time.to || !selectedTag) {
      toast.error("Please fill all the details");
      return;
    }
    setEvents([
      ...events,
      {
        title: title,
        date: selected_date.date,
        from: time.from,
        to: time.to,
        tag: selectedTag.name
      }
    ]);
    setVisible(!visible);

    setTitle('');
    setSelectedTag('');
    setSelected_date({ "index": "", "date": "" });
    setTime({ "from": "", "to": "" });
  }

  return (
    <div className="flex flex-col sm:mt-16 xs:mt-8">
      <h1 className="mx-auto dm-serif-text sm:text-[26px] xs:text-[22px]">{format(currentDate.toISOString(), "MMMM yyy")}</h1>

      {/* Displays days of week */}
      <div className="grid grid-cols-7 w-fit gap-x-[1px] sm:mt-8 xs:mt-6 mx-auto">
        {days.map((day, index) => (
          <div key={`weekDay_${index}`} className="flex lg:w-[6rem] md:w-[5rem] sm:w-[4rem] xs:w-[2.5rem] justify-center rounded-sm border-[1.4px] border-black">
            <p className="sm:text-[18px] font-bold">{day}</p>
          </div>
        ))}
      </div>

      {/* Displaying dates */}
      <div className="grid grid-rows-5 grid-cols-7 gap-[1px] mt-2 w-fit mx-auto">
        {Array.from({ length: startingDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysInMonth.map((day, index) => (
          <div key={`day_${index}`} className={`flex flex-col z-0 lg:w-[6rem] md:w-[5rem] sm:w-[4rem] xs:w-[2.5rem] h-[3rem] ${selected_date.index === `day_${index}` ? 'bg-slate-300' : ''} rounded-sm border-[1px] border-black cursor-pointer`} onClick={() => { setVisible(!visible); setSelected_date({ "index": `day_${index}`, "date": day }); }}>
            <p className="sm:text-[16px] xs:text-[14px] self-end">{format(day, "d")}</p>

            {/* For displaying events on that day */}
            <div className={`flex flex-col gap-y-1 w-full overflow-y-scroll`}>
              {events.map((event, event_index) => (
                <div key={`event_${event_index}`} className={`${format(day, "dd-MM-yyyy") === format(event.date, "dd-MM-yyyy") ? 'flex' : 'hidden'} z-10 bg-cyan-300 justify-center rounded-sm border hover:border-black overflow-clip`} onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); setEventVisible(!eventVisible);  }}>
                  <p className="">{event.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog header="Add Event" visible={visible} onHide={() => { setVisible(!visible); setTitle(''); setSelectedTag(''); setSelected_date({ "index": "", "date": "" }); setTime({ "from": "", "to": "" }); }} style={{ width: '30vw' }}  >
        <div className="flex flex-col gap-y-2 mb-5">
          {/* Event Title */}
          <p className="font-bold">Event Title</p>
          <input type="text" placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} className="outline-none px-2 py-0.5 caret-slate-400 rounded-md border border-black" />

          {/* Event Date */}
          <p className="font-bold">Event Date</p>
          <Calendar value={selected_date.date} disabled={true} dateFormat="dd-mm-yy" className="outline-none px-2 py-0.5 rounded-md border border-black" />

          {/* From Time */}
          <p className="font-bold">From</p>
          <Calendar value={time.from} onChange={(e) => setTime({ ...time, "from": e.target.value })} timeOnly showTime hourFormat="12" className="outline-none px-2 py-0.5 rounded-md border border-black" />

          {/* To Time */}
          <p className="font-bold">To</p>
          <Calendar value={time.to} onChange={(e) => setTime({ ...time, "to": e.target.value })} timeOnly showTime hourFormat="12" className="outline-none px-2 py-0.5 rounded-md border border-black" />

          {/* Tags */}
          <p className="font-bold">Tag</p>
          <Dropdown value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} options={tags} optionLabel="name" placeholder="Select a tag" className="outline-none caret-slate-400 px-2 py-0.5 rounded-md border border-black" />
          {/* <input type="text" placeholder="E.g :- Work, Personal, Meet etc" className="outline-none caret-slate-400 px-2 py-0.5 rounded-md border border-black" /> */}

          <button className="mt-4 px-2 py-0.5 bg-emerald-400 text-gray-700 rounded-md border w-fit mx-auto" onClick={handleSave}>Save</button>
        </div>
      </Dialog>

      <Dialog header="Event details" visible={eventVisible} onHide={() => setEventVisible(!eventVisible)} style={{ width: '30vw' }}>
          <div className="flex flex-col gap-y-2 mb-5">
            {/* Event Title */}
            <p className="font-bold">Event Title</p>
            <input disabled={disable} type="text" placeholder="Event Title" value={ selectedEvent ? selectedEvent.title : '' } onChange={(e) => setTitle(e.target.value)} className="outline-none px-2 py-0.5 caret-slate-400 rounded-md border border-black" />

            {/* Event Date */}
            <p className="font-bold">Event Date</p>
            <Calendar value={ selectedEvent ? selectedEvent.date : '' } disabled={disable} dateFormat="dd-mm-yy" className="outline-none px-2 py-0.5 rounded-md border border-black" />

            {/* From Time */}
            <p className="font-bold">From</p>
            <Calendar value={ selectedEvent ? selectedEvent.from : '' } disabled={disable} onChange={(e) => setTime({ ...time, "from": e.target.value })} timeOnly showTime hourFormat="12" className="outline-none px-2 py-0.5 rounded-md border border-black" />

            {/* To Time */}
            <p className="font-bold">To</p>
            <Calendar value={ selectedEvent ? selectedEvent.to : '' } disabled={disable} onChange={(e) => setTime({ ...time, "to": e.target.value })} timeOnly showTime hourFormat="12" className="outline-none px-2 py-0.5 rounded-md border border-black" />

            {/* Tags */}
            <p className="font-bold">Tag</p>
            <Dropdown value={ selectedEvent ? selectedEvent.tag : '' } disabled={disable} onChange={(e) => setSelectedTag(e.target.value)} options={tags} optionLabel="name" placeholder="Select a tag" className="outline-none caret-slate-400 px-2 py-0.5 rounded-md border border-black" />
            {/* <input type="text" placeholder="E.g :- Work, Personal, Meet etc" className="outline-none caret-slate-400 px-2 py-0.5 rounded-md border border-black" /> */}

            <button className="mt-4 px-2 py-0.5 bg-emerald-400 text-gray-700 rounded-md border w-fit mx-auto" onClick={() => {}}>Edit</button>
          </div>
      </Dialog>
    </div>
  )
}

export default EventCalendar
