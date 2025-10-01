export function formatDate(dateInput) {
  let date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    // Try to parse ISO string
    date = new Date(dateInput);
    if (isNaN(date)) {
      // fallback: try appending Z for UTC
      date = new Date(dateInput + 'Z');
    }
  } else {
    return '';
  }
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
