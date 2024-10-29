import React from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { hu } from 'date-fns/locale';
import { useCalendarStore } from '../store';
import EventForm from './EventForm';
import { Calendar as CalendarIcon, Plus, Trash2, Edit, ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react';
import { Event } from '../types';

export default function Calendar() {
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<Event | null>(null);
  const { events, currentUser, deleteEvent, currentDate, setCurrentDate, toggleUserSelector } = useCalendarStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dayEvents = (date: Date) =>
    events.filter((event) => isSameDay(new Date(event.start), date));

  const canManageEvent = (event: Event) => {
    if (!currentUser) return false;
    return currentUser.isAdmin || event.createdBy === currentUser.id;
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Magyar Naptár</h1>
        </div>
        <div className="flex items-center gap-4">
          {currentUser && (
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowEventForm(true);
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Új esemény
            </button>
          )}
          <button
            onClick={toggleUserSelector}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <UserCircle2 className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: hu })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-7 text-center py-2 border-b">
          {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map((day) => (
            <div key={day} className="font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => (
            <div
              key={day.toString()}
              className={`bg-white p-2 min-h-[120px] ${
                !isSameMonth(day, currentDate) ? 'opacity-50' : ''
              }`}
            >
              <div className="font-semibold text-sm mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents(day).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded-md relative group"
                    style={{ backgroundColor: event.color + '20', color: event.color }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{event.title}</span>
                      {canManageEvent(event) && (
                        <div className="hidden group-hover:flex gap-1">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowEventForm(true);
                            }}
                            className="p-1 hover:bg-white rounded"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteEvent(event.id)}
                            className="p-1 hover:bg-white rounded text-red-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEventForm && (
        <EventForm 
          onClose={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          event={editingEvent}
        />
      )}
    </div>
  );
}