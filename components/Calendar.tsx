import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface CalendarProps {
  unavailableDates: string[];
  onRangeSelect: (range: { start: Date | null, end: Date | null }) => void;
  initialStartDate: Date | null;
  initialEndDate: Date | null;
}

const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset*60*1000));
    return adjustedDate.toISOString().split('T')[0];
};

export const Calendar: React.FC<CalendarProps> = ({ unavailableDates, onRangeSelect, initialStartDate, initialEndDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const unavailableDatesSet = new Set(unavailableDates);

  const changeMonth = (amount: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const handleDateClick = (day: Date) => {
    if (day < today || unavailableDatesSet.has(formatDate(day))) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      onRangeSelect({ start: day, end: null });
    } else if (startDate && !endDate) {
      if (day < startDate) {
        setStartDate(day);
        onRangeSelect({ start: day, end: null });
      } else {
        // Check if range is valid
        let current = new Date(startDate);
        while (current <= day) {
            if(unavailableDatesSet.has(formatDate(current))) {
                // Invalid range
                setStartDate(day);
                setEndDate(null);
                onRangeSelect({ start: day, end: null });
                return;
            }
            current.setDate(current.getDate() + 1);
        }
        setEndDate(day);
        onRangeSelect({ start: startDate, end: day });
      }
    }
  };

  const renderDays = () => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-start-${i}`} className="w-full pt-[100%]"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dayString = formatDate(dayDate);
      
      const isPast = dayDate < today;
      const isUnavailable = unavailableDatesSet.has(dayString);
      const isDisabled = isPast || isUnavailable;

      let inRange = false;
      let isStart = false;
      let isEnd = false;

      const effectiveEndDate = endDate || hoverDate;

      if (startDate && effectiveEndDate && dayDate >= startDate && dayDate <= effectiveEndDate) {
        inRange = true;
      }
      if (startDate && formatDate(dayDate) === formatDate(startDate)) isStart = true;
      if (endDate && formatDate(dayDate) === formatDate(endDate)) isEnd = true;

      const baseClasses = "relative w-full h-0 pt-[100%] rounded-full flex items-center justify-center text-sm transition-colors duration-150";
      const stateClasses = isPast
        ? "text-slate-400 cursor-not-allowed"
        : isUnavailable
        ? "text-slate-400 line-through cursor-not-allowed"
        : "text-slate-700 hover:bg-slate-200 cursor-pointer";
      
      let bgClasses = "";
      if (isStart || isEnd) bgClasses = "bg-sky-500 text-white";
      else if (inRange) bgClasses = "bg-sky-500/20 text-sky-800";

      days.push(
        <div key={i}
             className={`${bgClasses} ${isStart ? 'rounded-r-none' : ''} ${isEnd ? 'rounded-l-none' : ''} ${!isStart && !isEnd && inRange ? 'rounded-none' : 'rounded-full'}`}>
            <button
                type="button"
                onClick={() => handleDateClick(dayDate)}
                onMouseEnter={() => !endDate && startDate && setHoverDate(dayDate)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={isDisabled}
                className={`${baseClasses} ${stateClasses}`}
                aria-label={`Select date ${i}`}
                aria-pressed={isStart || isEnd || inRange}
            >
             <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center">{i}</span>
             {isUnavailable && !isPast && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 bg-red-400 rounded-full"></span>
             )}
            </button>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="w-full" onMouseLeave={() => setHoverDate(null)}>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-200" aria-label="Previous month">
          <ChevronLeftIcon className="h-5 w-5 text-slate-500" />
        </button>
        <h3 className="font-bold text-slate-800 text-center">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-200" aria-label="Next month">
          <ChevronRightIcon className="h-5 w-5 text-slate-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-500 mb-2">
        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 items-center">
        {renderDays()}
      </div>
    </div>
  );
};