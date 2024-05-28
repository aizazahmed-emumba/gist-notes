import formatRelativeTime from './formatRelativeTime';
import { isValidJson } from './isValidJson';
import { isAuthenticated } from './UserUtils';

describe('formatRelativeTime', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return "just now" for the current date and time', () => {
    const now = new Date().toISOString();
    expect(formatRelativeTime(now)).toBe('just now');
  });

  it('should return "1 minute ago" for a date 1 minute ago', () => {
    const date = new Date(Date.now() - 1 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1 minute ago');
  });

  it('should return "X minutes ago" for a date X minutes ago', () => {
    const date = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('15 minutes ago');
  });

  it('should return "1 hour ago" for a date 1 hour ago', () => {
    const date = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1 hour ago');
  });

  it('should return "X hours ago" for a date X hours ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('5 hours ago');
  });

  it('should return "1 day ago" for a date 1 day ago', () => {
    const date = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('1 day ago');
  });

  it('should return "X days ago" for a date X days ago', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeTime(date)).toBe('3 days ago');
  });

  it('should return "Invalid date format" for an invalid ISO date string', () => {
    expect(formatRelativeTime('not-a-date')).toBe('Invalid date format');
  });

  it('should return "Invalid date format" for an empty string', () => {
    expect(formatRelativeTime('')).toBe('Invalid date format');
  });

  it('should return "Invalid date format" for a null or undefined input', () => {
    expect(formatRelativeTime(null)).toBe('Invalid date format');
    expect(formatRelativeTime(undefined)).toBe('Invalid date format');
  });
});

describe('isValidJson', () => {
  it('should return true for a valid JSON object', () => {
    const jsonString = '{"name":"John", "age":30, "city":"New York"}';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return true for a valid JSON array', () => {
    const jsonString = '[{"name":"John", "age":30}, {"name":"Jane", "age":25}]';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return true for a valid JSON string', () => {
    const jsonString = '"Hello, World!"';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return true for a valid JSON number', () => {
    const jsonString = '123';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return true for a valid JSON boolean', () => {
    const jsonString = 'true';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return true for a valid JSON null', () => {
    const jsonString = 'null';
    expect(isValidJson(jsonString)).toBe(true);
  });

  it('should return false for an invalid JSON string', () => {
    const jsonString = '{"name": "John", "age": 30,}';
    expect(isValidJson(jsonString)).toBe(false);
  });

  it('should return false for a malformed JSON string', () => {
    const jsonString = '{"name": "John" "age": 30}';
    expect(isValidJson(jsonString)).toBe(false);
  });

  it('should return false for a non-JSON string', () => {
    const jsonString = 'Just a regular string';
    expect(isValidJson(jsonString)).toBe(false);
  });

  it('should return false for an empty string', () => {
    const jsonString = '';
    expect(isValidJson(jsonString)).toBe(false);
  });

  it('should return false for a null input', () => {
    expect(isValidJson(null)).toBe(false);
  });

  it('should return false for an undefined input', () => {
    expect(isValidJson(undefined)).toBe(false);
  });

  it('should return false for a number input', () => {
    const numberInput = 123;
    expect(isValidJson(numberInput)).toBe(false);
  });

  it('should return false for a boolean input', () => {
    const booleanInput = true;
    expect(isValidJson(booleanInput)).toBe(false);
  });

  it('should return false for an object input', () => {
    const objectInput = { key: 'value' };
    expect(isValidJson(objectInput)).toBe(false);
  });
});

describe('isAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('should return true when there is a token in localStorage', () => {
    localStorage.setItem('token', 'some-token');
    expect(isAuthenticated()).toBe(true);
  });

  it('should return false when there is no token in localStorage', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('should return false when the token in localStorage is an empty string', () => {
    localStorage.setItem('token', '');
    expect(isAuthenticated()).toBe(false);
  });

  it('should return true when the token in localStorage is a non-empty string', () => {
    localStorage.setItem('token', 'non-empty-token');
    expect(isAuthenticated()).toBe(true);
  });

  it('should return false when localStorage is cleared', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.clear();
    expect(isAuthenticated()).toBe(false);
  });
});
