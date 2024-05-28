export const isValidJson = (json: string): boolean => {
  try {
    if (json === '' || json === null || json === undefined || typeof json !== 'string') {
      return false;
    }

    console.log(JSON.parse(json));
    return true;
  } catch (error) {
    return false;
  }
};
