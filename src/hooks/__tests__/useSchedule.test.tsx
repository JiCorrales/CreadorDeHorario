import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSchedule } from '../useSchedule';
import { Course } from '../../types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useSchedule Hook - Bulk Delete', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  const createMockCourse = (id: string, name: string): Course => ({
    id,
    name,
    campus: 'Cartago',
    group: '01',
    professor: 'Profesor X',
    credits: 4,
    quota: 30,
    reserved: false,
    status: 'Presencial',
    isScheduled: true,
    sessions: [],
    color: '#000000'
  });

  it('should remove multiple courses correctly', () => {
    const { result } = renderHook(() => useSchedule());

    // 1. Create a schedule
    act(() => {
      result.current.createSchedule('Test Schedule');
    });

    // 2. Add courses
    const course1 = createMockCourse('c1', 'Course 1');
    const course2 = createMockCourse('c2', 'Course 2');
    const course3 = createMockCourse('c3', 'Course 3');

    act(() => {
      result.current.addCourse(course1);
      result.current.addCourse(course2);
      result.current.addCourse(course3);
    });

    // Verify added
    expect(result.current.currentSchedule?.courses.length).toBe(3);

    // 3. Remove all courses
    act(() => {
      result.current.removeCourses(['c1', 'c2', 'c3']);
    });

    // 4. Verify removal
    expect(result.current.currentSchedule?.courses.length).toBe(0);
  });

  it('should remove only selected courses', () => {
    const { result } = renderHook(() => useSchedule());

    act(() => {
      result.current.createSchedule('Test Schedule');
    });

    const course1 = createMockCourse('c1', 'Course 1');
    const course2 = createMockCourse('c2', 'Course 2');
    const course3 = createMockCourse('c3', 'Course 3');

    act(() => {
      result.current.addCourse(course1);
      result.current.addCourse(course2);
      result.current.addCourse(course3);
    });

    // Remove c1 and c3
    act(() => {
      result.current.removeCourses(['c1', 'c3']);
    });

    expect(result.current.currentSchedule?.courses.length).toBe(1);
    expect(result.current.currentSchedule?.courses[0].id).toBe('c2');
  });

  it('should handle removal of non-existent IDs gracefully', () => {
    const { result } = renderHook(() => useSchedule());

    act(() => {
      result.current.createSchedule('Test Schedule');
    });

    const course1 = createMockCourse('c1', 'Course 1');
    act(() => {
      result.current.addCourse(course1);
    });

    // Remove c1 and a non-existent c99
    act(() => {
      result.current.removeCourses(['c1', 'c99']);
    });

    expect(result.current.currentSchedule?.courses.length).toBe(0);
  });
  
  it('should only remove courses from the current schedule', () => {
      const { result } = renderHook(() => useSchedule());
      
      // Schedule A
      act(() => {
          result.current.createSchedule('Schedule A');
      });
      const courseA = createMockCourse('cA', 'Course A');
      act(() => {
          result.current.addCourse(courseA);
      });
      
      // Schedule B
      act(() => {
          result.current.createSchedule('Schedule B');
      });
      const courseB = createMockCourse('cB', 'Course B');
      act(() => {
          result.current.addCourse(courseB);
      });
      
      // Ensure we are on Schedule B
      expect(result.current.currentSchedule?.name).toBe('Schedule B');
      
      // Try to remove course A (from Schedule A) while on Schedule B
      // The logic in removeCourses checks if schedule.id === currentScheduleId
      // So it should only affect the current schedule.
      // However, if we pass an ID that is NOT in the current schedule, nothing should happen to the current schedule.
      // And we want to ensure Schedule A is NOT touched either if we are strictly removing from current schedule context.
      
      act(() => {
          result.current.removeCourses(['cA', 'cB']);
      });
      
      // Course B should be gone from Schedule B
      expect(result.current.currentSchedule?.courses.length).toBe(0);
      
      // Switch back to Schedule A
      const scheduleAId = result.current.schedules.find(s => s.name === 'Schedule A')?.id;
      if (scheduleAId) {
          act(() => {
              result.current.setCurrentScheduleId(scheduleAId);
          });
      }
      
      // Course A should still be there because removeCourses logic only targets the currentScheduleId
      const scheduleA = result.current.schedules.find(s => s.name === 'Schedule A');
      expect(scheduleA?.courses.length).toBe(1);
      expect(scheduleA?.courses[0].id).toBe('cA');
  });
});
