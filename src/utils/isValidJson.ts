export const isValidJson  = (json:any): boolean =>  {
    try {
        JSON.parse(json);
        return true;
    } catch (error) {
        return false;
    }
}