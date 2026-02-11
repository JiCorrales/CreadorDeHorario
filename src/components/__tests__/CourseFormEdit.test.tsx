import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CourseForm from '../CourseForm';
import { Course } from '../../types';
import { DEFAULT_COURSE_COLOR } from '../../utils';

const mockMultiSessionCourse: Course = {
  id: 'c2',
  name: 'Fisica II',
  campus: 'Cartago',
  group: '02',
  professor: 'Maria',
  credits: 3,
  quota: 25,
  reserved: false,
  status: 'Presencial',
  isScheduled: true,
  color: DEFAULT_COURSE_COLOR,
  sessions: [
    { id: 's1', day: 'Martes', startTime: '07:30', endTime: '09:20', classroom: 'B1' },
    { id: 's2', day: 'Jueves', startTime: '09:30', endTime: '11:20', classroom: 'B2' },
    { id: 's3', day: 'Viernes', startTime: '13:00', endTime: '14:50', classroom: 'B3' }
  ]
};

describe('CourseForm Edit Mode', () => {
  it('should populate all sessions when editing a multi-session course', async () => {
    const handleUpdate = vi.fn();
    
    render(
      <CourseForm
        onAddCourse={vi.fn()}
        onUpdateCourse={handleUpdate}
        onCancelEdit={vi.fn()}
        courseToEdit={mockMultiSessionCourse}
      />
    );

    // Check if Session 1 is populated
    expect(screen.getByDisplayValue('Martes')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B1')).toBeInTheDocument();

    // Check if Session 2 is populated
    expect(screen.getByDisplayValue('Jueves')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B2')).toBeInTheDocument();

    // Check if Session 3 is populated
    expect(screen.getByDisplayValue('Viernes')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B3')).toBeInTheDocument();
  });
});
