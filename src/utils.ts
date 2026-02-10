export const generateId = () => Math.random().toString(36).substr(2, 9);

export const DAYS = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];

export const STATUSES = [
  'Presencial',
  'Virtual',
  'Semipresencial',
  'Asistido'
];

export const DEFAULT_COURSE_COLOR = '#0066CC';

export const PREDEFINED_COLORS = [
  '#0066CC', // Blue (Default)
  '#E53E3E', // Red
  '#DD6B20', // Orange
  '#38A169', // Green
  '#319795', // Teal
  '#3182CE', // Blue
  '#5A67D8', // Indigo
  '#805AD5', // Purple
  '#D53F8C', // Pink
  '#718096', // Gray
];

export const hexToRgb = (hex: string): { r: number, g: number, b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const hexToRgba = (hex: string, alpha: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

export const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
};
