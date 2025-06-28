
import React from 'react';
import { motion } from 'framer-motion';
import { TIMETABLE_STRUCTURE, DAYS, THEORY_TIME_SLOTS, LAB_TIME_SLOTS } from '@/data/ffcsSlots';

const TimetableCell = ({ slotString, userSlots }) => {
  const parts = slotString.split('/');
  const theorySlotName = parts[0].startsWith('L') || parts[0].startsWith('V') ? null : parts[0];
  const labSlotName = parts.length > 1 ? parts[1] : (parts[0].startsWith('L') ? parts[0] : null);
  const singleTheorySlot = parts.length === 1 && !parts[0].startsWith('L') ? parts[0] : null;

  const activeTheorySlot = userSlots.find(s => s.name === theorySlotName || s.name === singleTheorySlot);
  const activeLabSlot = userSlots.find(s => s.name === labSlotName);

  const isTheoryActive = !!activeTheorySlot;
  const isLabActive = !!activeLabSlot;

  const theorySubject = activeTheorySlot?.subject;
  const labSubject = activeLabSlot?.subject;
  
  const cellColor = isTheoryActive ? 'bg-cyan-900/50' : isLabActive ? 'bg-fuchsia-900/50' : 'bg-gray-900/50';

  return (
    <td className={`timetable-slot-td ${cellColor}`}>
      <div className="flex flex-col justify-center h-full">
        <div>
          {theorySlotName && <span className={isTheoryActive ? 'slot-active' : 'slot-inactive'}>{theorySlotName}</span>}
          {singleTheorySlot && <span className={isTheoryActive ? 'slot-active' : 'slot-inactive'}>{singleTheorySlot}</span>}
          {labSlotName && (
            <>
              <span className="text-gray-600">/</span>
              <span className={isLabActive ? 'slot-active text-fuchsia-400' : 'slot-inactive'}>{labSlotName}</span>
            </>
          )}
        </div>
        {(isTheoryActive && theorySubject !== theorySlotName) && <div className="text-cyan-400 text-[10px] font-semibold truncate mt-1">{theorySubject}</div>}
        {(isLabActive && labSubject !== labSlotName) && <div className="text-fuchsia-400 text-[10px] font-semibold truncate mt-1">{labSubject}</div>}
      </div>
    </td>
  );
};

const Timetable = ({ slots }) => {
  return (
    <motion.div 
      className="overflow-x-auto glassmorphism rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="timetable-header-th bg-gray-800">THEORY</th>
            {THEORY_TIME_SLOTS.slice(0, 5).map(ts => <th key={ts} className="timetable-header-th bg-gray-900">{ts.replace(' to ', '\nto\n')}</th>)}
            <th rowSpan="2" className="timetable-lunch-td">LUNCH</th>
            {THEORY_TIME_SLOTS.slice(5).map(ts => <th key={ts} className="timetable-header-th bg-gray-900">{ts.replace(' to ', '\nto\n')}</th>)}
          </tr>
          <tr>
            <th className="timetable-header-th bg-gray-800">LAB</th>
            {LAB_TIME_SLOTS.slice(0, 6).map(ts => <th key={ts} className="timetable-header-th bg-gray-900">{ts.replace(' to ', '\nto\n')}</th>)}
            {LAB_TIME_SLOTS.slice(6).map(ts => <th key={ts} className="timetable-header-th bg-gray-900">{ts.replace(' to ', '\nto\n')}</th>)}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td className="timetable-day-td">{day}</td>
              {TIMETABLE_STRUCTURE[day].slice(0, 6).map((slot, index) => (
                <TimetableCell key={`${day}-am-${index}`} slotString={slot} userSlots={slots} />
              ))}
              <td className="timetable-lunch-td"></td>
              {TIMETABLE_STRUCTURE[day].slice(6).map((slot, index) => (
                <TimetableCell key={`${day}-pm-${index}`} slotString={slot} userSlots={slots} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default Timetable;
