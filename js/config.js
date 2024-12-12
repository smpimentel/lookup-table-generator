// Parameter Types Configuration
const PARAMETER_TYPES = {
    NUMBER: {
        value: 'NUMBER',
        label: 'Number',
        units: [
            { value: 'GENERAL', label: 'General' },
            { value: 'PERCENTAGE', label: 'Percentage' }
        ]
    },
    LENGTH: {
        value: 'LENGTH',
        label: 'Length',
        units: [
            { value: 'INCHES', label: 'Inches' },
            { value: 'FEET', label: 'Feet' }
        ]
    },
    AREA: {
        value: 'AREA',
        label: 'Area',
        units: [
            { value: 'SQUARE_FEET', label: 'Square Feet' }
        ]
    },
    VOLUME: {
        value: 'VOLUME',
        label: 'Volume',
        units: [
            { value: 'CUBIC_FEET', label: 'Cubic Feet' }
        ]
    },
    ANGLE: {
        value: 'ANGLE',
        label: 'Angle',
        units: [
            { value: 'DEGREES', label: 'Degrees' }
        ]
    },
    OTHER: {
        value: 'OTHER',
        label: 'Other',
        units: [
            { value: 'GENERAL', label: 'General' }
        ]
    }
};