export default function formatRelativeTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    const now = new Date();

    const timeDifference = now.getTime() - date.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)); // Calculate remaining minutes
    const days = Math.floor(hours / 24);

    if (days > 0) {
        if (days === 1) {
            return '1 day ago';
        } else {
            return days + ' days ago';
        }
    } else if (hours > 0) {
        if (hours === 1) {
            return '1 hour ago';
        } else {
            return hours + ' hours ago';
        }
    } else if (minutes > 0) {
        if (minutes === 1) {
            return '1 minute ago';
        } else {
            return minutes + ' minutes ago';
        }
    } else {
        return 'just now';
    }
}
