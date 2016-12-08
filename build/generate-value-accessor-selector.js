// Usage:
// node generate-value-accessor-selector TextField TextView

function generateValueAccessorSelector(tagNames) {
    const tags = [];
    tagNames.forEach(tagName => {
        tags.push(tagName); // regular tag
        tags.push(tagName.charAt(0).toLowerCase() + tagName.slice(1)); // lowercase first char
        tags.push(tagName.split(/(?=[A-Z])/).join("-").toLowerCase()); // kebab case
    });

    const selectors = [];
    for (const tag of tags) {
        for (const directive of ["ngModel", "formControlName"]) {
            selectors.push(`${tag}[${directive}]`);
        }
    }
    return selectors.join(", ");
}

process.argv.shift();
process.argv.shift();
console.log(generateValueAccessorSelector(process.argv));
