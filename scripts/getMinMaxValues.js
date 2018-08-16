function getMinMaxValues(feature) {
    let maxValue = 0;
    let minValue = 0;
    let counter = 0;

    for (const song in data) {
        let value = data[song][feature];
        if (counter === 0) {
            maxValue = value;
            minValue = value;
        }
        if (value > maxValue) {
            maxValue = value;
        }
        if (value < minValue) {
            minValue = value;
        }
        counter++;
    }

    featuresMinMax.push({
        "feature": feature,
        "min": minValue,
        "max": maxValue
    });
}