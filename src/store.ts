import { create } from 'zustand';
import { Event, User, AuthUser } from './types';

interface CalendarStore {
  events: Event[];
  users: User[];
  currentUser: AuthUser | null;
  currentDate: Date;
  isUserSelectorVisible: boolean;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  setCurrentUser: (user: AuthUser) => void;
  login: (id: string, password: string) => boolean;
  logout: () => void;
  setCurrentDate: (date: Date) => void;
  toggleUserSelector: () => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  users: [
    { id: '1', name: 'Kovács János', color: '#FF5733', password: 'janos123' },
    { id: '2', name: 'Nagy Éva', color: '#33FF57', password: 'eva123' },
    { id: '3', name: 'Szabó Péter', color: '#3357FF', password: 'peter123' },
    { id: 'admin', name: 'Rendszergazda', color: '#9333FF', password: 'admin123', isAdmin: true },
  ],
  currentUser: null,
  currentDate: new Date(),
  isUserSelectorVisible: false,
  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, { ...event, id: crypto.randomUUID() }],
    })),
  updateEvent: (id, updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      ),
    })),
  deleteEvent: (id) =>
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    })),
  setCurrentUser: (user) => set({ currentUser: user }),
  login: (id, password) => {
    const user = get().users.find(u => u.id === id && u.password === password);
    if (user) {
      const { password: _, ...authUser } = user;
      set({ currentUser: authUser });
      return true;
    }
    return false;
  },
  logout: () => set({ currentUser: null }),
  setCurrentDate: (date) => set({ currentDate: date }),
  toggleUserSelector: () => set((state) => ({ isUserSelectorVisible: !state.isUserSelectorVisible })),
}));