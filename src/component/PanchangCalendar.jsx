"use client";

import { useState, useMemo, useEffect } from "react";
import { MhahPanchang } from "mhah-panchang";
import styles from "./PanchangCalendar.module.css";
import { config } from "../conf/config";

const weekDays = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const monthsHindi = [
  "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

// Delhi location
const LAT = 28.6139;
const LON = 77.2090;

// Single Panchang instance
const panchang = new MhahPanchang();

export default function PanchangCalendar() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  /* ---------------- FETCH EVENTS ---------------- */
  useEffect(() => {
    const getEvents = async () => {
      const url = `${config.apiBaseUrl}/events`;
      const response = await fetch(url);
      const resJson = await response.json();

      // Group events by YYYY-MM-DD
      const map = {};
      resJson?.data?.events?.forEach((ev) => {
        if (!ev.start_time || ev.start_time === "0000-00-00 00:00:00") return;

        const dateKey = ev.start_time.split(" ")[0];
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(ev);
      });

      setEvents(map);
    };

    getEvents();
  }, []);

  /* ---------------- BUILD CALENDAR ---------------- */
  const calendarCells = useMemo(() => {
    const cells = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    // Panchang per date
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d, 5, 30);
      const cal = panchang.calendar(dateObj, LAT, LON);

      cells.push({
        date: d,
        tithi: cal.Tithi?.name_en_IN || "",
        nakshatra: cal.Nakshatra?.name_en_IN || "",
      });
    }

    return cells;
  }, [month, year]);

  /* ---------------- OPEN MODAL ---------------- */
  const openPopup = (dateKey) => {
    setSelectedDate(dateKey);
    setSelectedEvents(events[dateKey] || []);
  };

  return (
    <div className="bg-[#ffd200] p-4">
      {/* Month / Year Selector */}
      <div className="flex justify-center gap-4 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(+e.target.value)}
          className="border border-red-700 px-3 py-1"
        >
          {monthsHindi.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(+e.target.value)}
          className="border border-red-700 px-3 py-1"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className={styles.calendar}>
        {weekDays.map((d) => (
          <div key={d} className={styles.dayHeader}>{d}</div>
        ))}

        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return <div key={idx} className={styles.emptyCell}></div>;
          }

          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(cell.date).padStart(2, "0")}`;
          const dayEvents = events[dateKey] || [];

          return (
            <div
              key={idx}
              className={styles.dateCell}
              onClick={() => dayEvents.length && openPopup(dateKey)}
            >
              {/* Date number */}
              <div className={styles.dateTopLeft}>{cell.date}</div>

              {/* Events inside cell */}
              <div className={styles.eventsContainer}>
                {dayEvents.slice(0, 2).map((ev) => (
                  <div
                    key={ev.id}
                    className={styles.eventPill}
                    style={{ background: ev.type || "#b00000" }}
                  >
                    {ev.title}
                  </div>
                ))}

                {dayEvents.length > 2 && (
                  <div className={styles.moreEvents}>
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>

              {/* Panchang sides */}
              <div className={styles.sideLeft}>{cell.tithi}</div>
              <div className={styles.sideRight}>{cell.nakshatra}</div>
            </div>
          );
        })}
      </div>

      {/* Popup Modal */}
      {selectedDate && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDate(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">
              Events on {selectedDate}
            </h3>

            {selectedEvents.map((ev) => (
              <div key={ev.id} className={styles.modalEvent}>
                <div className="font-semibold">{ev.title}</div>
                <div className="text-sm">{ev.location}</div>
                <div className="text-xs">{ev.start_time}</div>
              </div>
            ))}

            <button
              className="mt-3 px-4 py-1 bg-red-700 text-white rounded"
              onClick={() => setSelectedDate(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
