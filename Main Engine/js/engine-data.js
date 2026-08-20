const sensorWidgets = [
    { tag: "inlet_lube_oil_pressure.value", label: "Inlet Lube Oil Pressure", value: 4.5, min: 0, max: 8, unit: "bar" },
    { tag: "ht_cooling_water_aftercooler_temperature.value", label: "HT Cooling Water Temperature", value: 78, min: 0, max: 120, unit: "°C" },
    { tag: "fuel_oil_inlet_pressure.value", label: "Fuel Oil Inlet Pressure", value: 5.2, min: 0, max: 10, unit: "bar" },
    { tag: "charge_air_pressure.value", label: "Charge Air Pressure", value: 2.1, min: 0, max: 5, unit: "bar" },
    { tag: "derived.max_cylinder_exhaust_temperature", label: "Max Cylinder Exhaust Temperature", value: 430, min: 0, max: 700, unit: "°C" }
];

function createEngine(id, name, tagPrefix, valueOffset = 0) {
    return {
        id,
        name,
        tagPrefix,
        status: "Standby",
        rpm: { value: 0, min: 0, max: 2100, unit: "RPM" },
        sensors: sensorWidgets.map(sensor => ({
            ...sensor,
            value: sensor.value + valueOffset
        }))
    };
}

const engines = [
    createEngine("port", "Port Main Engine", "vms.port_main_engine"),
    createEngine("starboard", "Starboard Main Engine", "vms.stbd_main_engine", 0.2)
];

export default engines;