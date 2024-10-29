import React from 'react';
import { X } from 'lucide-react';
import { useCalendarStore } from '../store';
import { Event } from '../types';
import { format } from 'date-fns';

interface EventFormProps {
  onClose: () => void;
  event?: Event | null;
}

export default function EventForm({ onClose, event }: EventFormProps) {
  const { addEvent, updateEvent, currentUser } = useCalendarStore();
  const [title, setTitle] = React.useState(event?.title || '');
  const [description, setDescription] = React.useState(event?.description || '');
  const [start, setStart] = React.useState(
    event ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [end, setEnd] = React.useState(
    event ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm") : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const eventData = {
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      createdBy: event?.createdBy || currentUser.id,
      color: event?.color || currentUser.color,
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {event ? 'Esemény szerkesztése' : 'Új esemény létrehozása'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Esemény címe
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leírás
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kezdés
              </label>
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Befejezés
              </label>
              <input
                type="datetime-local"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {event ? 'Módosítások mentése' : 'Esemény mentése'}
          </button>
        </form>
      </div>
    </div>
  );
}