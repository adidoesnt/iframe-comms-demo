export function convertStyles(style) {
    let result = JSON.stringify(style);
    result = result
        .replace(/,/gi, ';')
        .replace('{', '')
        .replace('}', ';')
        .replace(/"/gi, '');
    return result;
}