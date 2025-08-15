export const toDbColumns = <T extends object>(obj: T) => {
    const keys = Object.keys(obj);
    const cols = keys.map((k) => "${k}").join(', ');
    const params = keys.map((_k, i) => `$${i + 1}`).join(', ');
    const values = Object.values(obj);
    return { cols, params, values };
};