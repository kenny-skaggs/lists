
const _debounceMap = {};
export function debounce(key, fn, ms = 300) {
    if (_debounceMap[key] !== undefined) {
        clearTimeout(_debounceMap[key]);
    }

    _debounceMap[key] = setTimeout(fn, ms);
}

export function alphabeticalSort (array, property_name) {
    return array.sort((a, b) => {
        const aValue = a[property_name];
        const bValue = b[property_name];

        if (aValue < bValue) {
            return -1;
        } else if (aValue > bValue) {
            return 1;
        } else {
            return 0;
        }
    });
}
