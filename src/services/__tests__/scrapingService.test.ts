import { describe, it, expect } from 'vitest';
import { parseTecHtml } from '../scrapingService';

describe('Scraping Service', () => {
    it('should parse student profile with multiple rows for the same course (multiple sessions)', () => {
        const html = `
        <div id="t_guia_horario">
            <table id="tguiaHorario">
                <tbody>
                    <tr>
                        <td>CA2125</td>
                        <td>Elementos de computación</td>
                        <td>01</td>
                        <td>3</td>
                        <td>Martes - 9:30:11:20</td>
                        <td>B6-04</td>
                        <td>Mata Rodriguez William</td>
                        <td>24</td>
                        <td>Curso Comun</td>
                        <td>Regular</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>CA2125</td>
                        <td>Elementos de computación</td>
                        <td>01</td>
                        <td>3</td>
                        <td>Jueves - 9:30:11:20</td>
                        <td>B6-04</td>
                        <td>Mata Rodriguez William</td>
                        <td>24</td>
                        <td>Curso Comun</td>
                        <td>Regular</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;

        const courses = parseTecHtml(html);

        // We expect ONE course with TWO sessions
        expect(courses.length).toBe(1);
        const course = courses[0];
        expect(course.originalCode).toBe('CA2125');
        expect(course.group).toBe('01');
        expect(course.sessions.length).toBe(2);
        
        // Verify Session 1
        expect(course.sessions[0].day).toBe('Martes');
        expect(course.sessions[0].startTime).toBe('09:30');
        expect(course.sessions[0].endTime).toBe('11:20');

        // Verify Session 2
        expect(course.sessions[1].day).toBe('Jueves');
        expect(course.sessions[1].startTime).toBe('09:30');
        expect(course.sessions[1].endTime).toBe('11:20');
    });

    it('should deduplicate identical sessions (same day/time)', () => {
         const html = `
        <div id="t_guia_horario">
            <table id="tguiaHorario">
                <tbody>
                    <tr>
                        <td>CA2125</td>
                        <td>Elementos de computación</td>
                        <td>01</td>
                        <td>3</td>
                        <td>Martes - 9:30:11:20</td>
                        <td>B6-04</td>
                        <td>Mata Rodriguez William</td>
                        <td>24</td>
                        <td>Curso Comun</td>
                        <td>Regular</td>
                        <td>1</td>
                    </tr>
                    <tr>
                        <td>CA2125</td>
                        <td>Elementos de computación</td>
                        <td>01</td>
                        <td>3</td>
                        <td>Martes - 9:30:11:20</td>
                        <td>B6-04</td>
                        <td>Other Prof</td>
                        <td>24</td>
                        <td>Curso Comun</td>
                        <td>Regular</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;
        const courses = parseTecHtml(html);
        expect(courses.length).toBe(1);
        expect(courses[0].sessions.length).toBe(1);
    });
});
