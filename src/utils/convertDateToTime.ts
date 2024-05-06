export const convertDateToTime = (isoDate : string) : string => {
    try {
        // Parse ISO date
        let dateObject = new Date(isoDate);
        // Convert to time
        let time = dateObject.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit'});
        return time;
    } catch (error) {
        return "Invalid date format";
    }
}