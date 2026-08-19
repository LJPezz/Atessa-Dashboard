const iconsData = [
    {
        name: "Generator #1 Engine",
        status: "Running",
        rpm: { value: 1800, min: 0, max: 3000, unit: "RPM" },
        temperature: { value: 725, min: 0, max: 900, unit: "°F" },
        coolant: { value: 185, min: 100, max: 220, unit: "°F" },
        lubeOil: { value: 62, min: 0, max: 100, unit: "PSI" },
        voltage: { value: 13.8, min: 0, max: 16, unit: "VDC" }
    },
    {
        name: "Generator #2 Engine",
        status: "Standby",
        rpm: { value: 0, min: 0, max: 3000, unit: "RPM" },
        temperature: { value: 95, min: 0, max: 900, unit: "°F" },
        coolant: { value: 120, min: 100, max: 220, unit: "°F" },
        lubeOil: { value: 8, min: 0, max: 100, unit: "PSI" },
        voltage: { value: 12.6, min: 0, max: 16, unit: "VDC" }
    },
    {
        name: "Generator #3 Engine",
        status: "Running",
        rpm: { value: 1800, min: 0, max: 3000, unit: "RPM" },
        temperature: { value: 780, min: 0, max: 900, unit: "°F" },
        coolant: { value: 198, min: 100, max: 220, unit: "°F" },
        lubeOil: { value: 58, min: 0, max: 100, unit: "PSI" },
        voltage: { value: 13.7, min: 0, max: 16, unit: "VDC" }
    }
];

export default iconsData;