const engine = {
        id: "main-engine",
        name: "Main Engine",
        status: "Standby",
        rpm: { value: 0, min: 0, max: 2100, unit: "RPM" },
        sensors: [
            { key: "startAir", label: "Start Air", value: 177, min: 0, max: 250, unit: "PSI" },
            { key: "lubeOil", label: "Lube Oil Pressure", value: 62, min: 0, max: 100, unit: "PSI" },
            { key: "chargeAir", label: "Charge Air Pressure", value: 18, min: 0, max: 50, unit: "PSI" },
            { key: "fuelOil", label: "Fuel Oil Pressure", value: 35, min: 0, max: 100, unit: "PSI" },
            { key: "temperature", label: "Engine Temperature", value: 725, min: 0, max: 900, unit: "°F" },
            { key: "coolant", label: "Coolant Temperature", value: 185, min: 100, max: 220, unit: "°F" }
        ]
};

export default engine;