export function convertToCustomDateFormat(isoDate:string) : string {
    try {
        // Parse ISO date
        let dateObject = new Date(isoDate);
        // Convert to custom format
        let customDateFormat = dateObject.toLocaleString('en-us', { day: '2-digit', month: 'short', year: 'numeric' });
        return customDateFormat;
    } catch (error) {
        return "Invalid date format";
    }
}