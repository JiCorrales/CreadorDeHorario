import React, { useState, useEffect } from 'react';
import { Course, CourseStatus, CourseSession } from '../types';
import { generateId, DAYS, STATUSES } from '../utils';
import { PlusCircle, Clock, MapPin, Save, X, Edit } from 'lucide-react';

interface CourseFormProps {
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onCancelEdit: () => void;
  courseToEdit?: Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({
  onAddCourse,
  onUpdateCourse,
  onCancelEdit,
  courseToEdit
}) => {
  const [name, setName] = useState('');
  const [campus, setCampus] = useState('');
  const [group, setGroup] = useState('');
  const [professor, setProfessor] = useState('');
  const [quota, setQuota] = useState(0);
  const [reserved, setReserved] = useState(false);
  const [status, setStatus] = useState<CourseStatus>('Presencial');

  const [frequency, setFrequency] = useState<1 | 2>(1);
  const [sessions, setSessions] = useState<Omit<CourseSession, 'id'>[]>([
    { day: 'Lunes', startTime: '', endTime: '', classroom: '' }
  ]);

  // Load course data when editing
  useEffect(() => {
    if (courseToEdit) {
      setName(courseToEdit.name);
      setCampus(courseToEdit.campus);
      setGroup(courseToEdit.group);
      setProfessor(courseToEdit.professor);
      setQuota(courseToEdit.quota);
      setReserved(courseToEdit.reserved);
      setStatus(courseToEdit.status);

      const sessionCount = courseToEdit.sessions.length;
      setFrequency(sessionCount > 1 ? 2 : 1);

      // Clean up session IDs for the form state
      setSessions(courseToEdit.sessions.map(({ day, startTime, endTime, classroom }) => ({
        day, startTime, endTime, classroom
      })));
    } else {
      resetForm();
    }
  }, [courseToEdit]);

  // Adjust sessions when frequency changes manually
  useEffect(() => {
    if (!courseToEdit) {
        // Only adjust if not loading a course, or if user explicitly changes frequency
        // Actually, better logic:
        if (frequency === 1 && sessions.length > 1) {
            setSessions(prev => [prev[0]]);
        } else if (frequency === 2 && sessions.length < 2) {
             setSessions(prev => [...prev, { day: 'Jueves', startTime: '', endTime: '', classroom: '' }]);
        }
    } else {
        // If editing, and user changes frequency
        if (frequency === 1 && sessions.length > 1) {
            setSessions(prev => [prev[0]]);
        } else if (frequency === 2 && sessions.length < 2) {
             setSessions(prev => [...prev, { day: 'Jueves', startTime: '', endTime: '', classroom: '' }]);
        }
    }
  }, [frequency]);

  const resetForm = () => {
    setName('');
    setCampus('');
    setGroup('');
    setProfessor('');
    setQuota(0);
    setReserved(false);
    setStatus('Presencial');
    setFrequency(1);
    setSessions([{ day: 'Lunes', startTime: '', endTime: '', classroom: '' }]);
  };

  const handleSessionChange = (index: number, field: keyof Omit<CourseSession, 'id'>, value: string) => {
    const newSessions = [...sessions];
    newSessions[index] = { ...newSessions[index], [field]: value };
    setSessions(newSessions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new sessions with IDs (reuse existing IDs if editing? better to regenerate or keep?)
    // If editing, we should try to keep IDs if possible, but sessions structure might have changed.
    // For simplicity, let's regenerate session IDs or map them.

    let finalSessions: CourseSession[];

    if (courseToEdit) {
        // Try to preserve IDs for existing indices
        finalSessions = sessions.map((s, i) => ({
            ...s,
            id: courseToEdit.sessions[i]?.id || generateId()
        }));
    } else {
        finalSessions = sessions.map(s => ({ ...s, id: generateId() }));
    }

    const courseData: Course = {
      id: courseToEdit ? courseToEdit.id : generateId(),
      name,
      campus,
      group,
      professor,
      quota,
      reserved,
      status,
      isScheduled: courseToEdit ? courseToEdit.isScheduled : false, // Keep scheduled status if editing
      sessions: finalSessions
    };

    if (courseToEdit) {
        onUpdateCourse(courseData);
    } else {
        onAddCourse(courseData);
        resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6 border-t-4 border-blue-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          {courseToEdit ? <Edit className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
          {courseToEdit ? 'Editar Curso' : 'Agregar Nuevo Curso'}
        </h2>
        {courseToEdit && (
            <button
                type="button"
                onClick={onCancelEdit}
                className="text-gray-500 hover:text-gray-700"
                title="Cancelar Edición"
            >
                <X className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* General Info */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Curso</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Cálculo I"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sede</label>
          <input
            type="text"
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. Cartago"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profesor(es)</label>
          <input
            type="text"
            value={professor}
            onChange={e => setProfessor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del profesor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grupo</label>
          <input
            type="text"
            value={group}
            onChange={e => setGroup(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cupo</label>
          <input
            type="number"
            value={quota}
            onChange={e => setQuota(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as CourseStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            id="reserved"
            checked={reserved}
            onChange={e => setReserved(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="reserved" className="ml-2 block text-sm text-gray-900">
            Reservado
          </label>
        </div>
      </div>

      {/* Frequency and Sessions */}
      <div className="border-t pt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia Semanal</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="frequency"
                checked={frequency === 1}
                onChange={() => setFrequency(1)}
              />
              <span className="ml-2">Una vez por semana</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="frequency"
                checked={frequency === 2}
                onChange={() => setFrequency(2)}
              />
              <span className="ml-2">Dos veces por semana</span>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
              <h4 className="font-medium text-sm text-gray-700 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Sesión {index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Día</label>
                  <select
                    value={session.day}
                    onChange={e => handleSessionChange(index, 'day', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {DAYS.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={session.startTime}
                    onChange={e => handleSessionChange(index, 'startTime', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={session.endTime}
                    onChange={e => handleSessionChange(index, 'endTime', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Aula</label>
                  <div className="relative">
                    <MapPin className="w-3 h-3 absolute left-2 top-2 text-gray-400" />
                    <input
                      type="text"
                      value={session.classroom}
                      onChange={e => handleSessionChange(index, 'classroom', e.target.value)}
                      className="w-full pl-7 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Aula"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {courseToEdit && (
            <button
                type="button"
                onClick={onCancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
                Cancelar
            </button>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
        >
          {courseToEdit ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {courseToEdit ? 'Guardar Cambios' : 'Agregar Curso'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
