export default function formatRelativeTime(isoDateString: string): string {
    const date = new Date(isoDateString);
    const now = new Date();

    const timeDifference = now.getTime() - date.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
        if (days === 1) {
            return '1 day ago';
        } else {
            return days + ' days ago';
        }
    } else if (hours === 0) {
        return 'just now';
    } else if (hours === 1) {
        return '1 hour ago';
    } else {
        return hours + ' hours ago';
    }
}
