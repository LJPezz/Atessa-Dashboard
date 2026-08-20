const sensorWidgets = [
    { tag: "inlet_lube_oil_pressure.value", label: "Lube oil pressure", value: 4.5, min: 0, max: 8, unit: "bar" },
    { tag: "ht_cooling_water_aftercooler_temperature.value", label: "HT cooling water", value: 78, min: 0, max: 120, unit: "°C" },
    { tag: "fuel_oil_inlet_pressure.value", label: "Fuel oil pressure", value: 5.2, min: 0, max: 10, unit: "bar" },
    { tag: "charge_air_pressure.value", label: "Charge air pressure", value: 2.1, min: 0, max: 5, unit: "bar" },
    { tag: "derived.max_cylinder_exhaust_temperature", label: "Max exhaust temp", value: 430, min: 0, max: 700, unit: "°C" }
];

function createEngine(id, name, tagPrefix, rpm, valueOffset = 0) {
    return {
        id,
        name,
        tagPrefix,
        status: "Running",
        rpm: { value: rpm, min: 0, max: 2200, unit: "RPM" },
        sensors: sensorWidgets.map(sensor => ({ ...sensor, value: sensor.value + valueOffset }))
    };
}

export default [
    createEngine("port", "Port Engine Speed", "vms.port_main_engine", 1937),
    createEngine("starboard", "Starboard Engine Speed", "vms.stbd_main_engine", 1884, 0.2)
];