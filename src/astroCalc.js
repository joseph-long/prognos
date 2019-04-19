function toJulianDate(Y, M, D) {
// JDN = (1461 × (Y + 4800 + (M − 14)/12))/4 +(367 × (M − 2 − 12 × ((M − 14)/12)))/12 − (3 × ((Y + 4900 + (M - 14)/12)/100))/4 + D − 32075
// (1461 * (Y + 4800 + (M - 14)/12))/4 + (367 * (M - 2 - 12 * ((M - 14)/12)))/12 - (3 * ((Y + 4900 + (M - 14)/12)/100))/4 + D - 32075
    return ((1461 * (Y + 4800 + ((M - 14)/12|0)))/4|0) + ((367 * (M - 2 - 12 * ((M - 14)/12|0)))/12|0) - ((3 * ((Y + 4900 + ((M - 14)/12|0))/100|0))/4|0) + D - 32075;
}

export {
    toJulianDate
}

// function toJulianDate(year, month, day) { return ((1461 * (Y + 4800 + ((M - 14)/12|0)))/4|0) + ((367 * (M - 2 - 12 * ((M - 14)/12|0)))/12|0) - ((3 * ((Y + 4900 + ((M - 14)/12|0))/100|0))/4|0) + D - 32075; }