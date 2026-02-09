import React, { useState } from 'react';
import { Schedule } from '../types';
import { Plus, Trash } from 'lucide-react';

interface ScheduleManagerProps {
  schedules: Schedule[];
  currentScheduleId: string | null;
  onSwitchSchedule: (id: string) => void;
  onCreateSchedule: (name: string) => void;
  onDeleteSchedule: (id: string) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({
  schedules,
  currentScheduleId,
  onSwitchSchedule,
  onCreateSchedule,
  onDeleteSchedule
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreateSchedule(newName.trim());
      setNewName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center transition-colors duration-200">
      <div className="flex gap-2 overflow-x-auto pb-2 flex-grow no-scrollbar">
        {schedules.map(schedule => (
          <div
            key={schedule.id}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-colors border whitespace-nowrap
              ${currentScheduleId === schedule.id
                ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'}
            `}
            onClick={() => onSwitchSchedule(schedule.id)}
          >
            <span className="font-medium">{schedule.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('¿Estás seguro de eliminar este horario?')) {
                  onDeleteSchedule(schedule.id);
                }
              }}
              className={`p-1 rounded-full hover:bg-white/20 ${currentScheduleId === schedule.id ? 'text-blue-100' : 'text-gray-400 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'}`}
            >
              <Trash className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {isCreating ? (
        <form onSubmit={handleCreate} className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nombre..."
            className="px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm dark:bg-green-700 dark:hover:bg-green-800"
          >
            OK
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-sm dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            X
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4" />
          Nuevo Horario
        </button>
      )}
    </div>
  );
};

export default ScheduleManager;
