import React from 'react';
import Calendar from './components/Calendar';
import UserSelector from './components/UserSelector';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Calendar />
      <UserSelector />
    </div>
  );
}

export default App;