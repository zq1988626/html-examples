if (IE <= 8) {
    try {
        if (Normalizations[propertyName]) {
            Normalizations[propertyName](element, propertyValue);
        }
        else {
            element.style[propertyName] = propertyValue;
        }
    }
    catch (error) {
        if (debug) {
            console.log(`Browser does not support [${propertyValue}] for [${propertyName}]`);
        }
    }
}
