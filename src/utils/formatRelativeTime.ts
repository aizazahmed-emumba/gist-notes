export default function formatRelativeTime(isoDateString: string): string {
  if (!isoDateString) {
    return 'Invalid date format';
  }

  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date format';
  }
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Calculate remaining minutes
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (days === 1) {
      return '1 day ago';
    }
    return `${days} days ago`;
  }
  if (hours > 0) {
    if (hours === 1) {
      return '1 hour ago';
    }
    return `${hours} hours ago`;
  }
  if (minutes > 0) {
    if (minutes === 1) {
      return '1 minute ago';
    }
    return `${minutes} minutes ago`;
  }
  return 'just now';
}
