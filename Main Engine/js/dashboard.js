import engine from './engine-data.js';

const dashboard = document.getElementById('engine-dashboard');
const statusClassMap = {
    Running: 'status-running',
    Standby: 'status-standby',
    Maintenance: 'status-maintenance',
    Offline: 'status-offline'
};

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function formatValue(value) {
    return value < 10 && value !== 0 ? value.toFixed(2) : value.toFixed(1);
}

function buildDial(engine) {
    const dial = document.createElement('div');
    dial.className = `dial ${statusClassMap[engine.status] || 'status-offline'}`;
    dial.dataset.rpmMin = engine.rpm.min;
    dial.dataset.rpmMax = engine.rpm.max;

    const ticks = document.createElement('div');
    ticks.className = 'dial-ticks';
    for (let index = 0; index <= 30; index += 1) {
        const tick = document.createElement('span');
        tick.className = index % 5 === 0 ? 'dial-tick dial-tick-major' : 'dial-tick';
        tick.style.setProperty('--tick-angle', `${-135 + (index / 30) * 270}deg`);
        ticks.appendChild(tick);
    }

    for (let index = 0; index <= 6; index += 1) {
        const label = document.createElement('span');
        label.className = 'dial-mark-label';
        label.textContent = Math.round(engine.rpm.max / 6 * index).toLocaleString();
        label.style.setProperty('--mark-angle', `${-135 + (index / 6) * 270}deg`);
        ticks.appendChild(label);
    }

    const rpmPercent = clamp((engine.rpm.value - engine.rpm.min) / (engine.rpm.max - engine.rpm.min), 0, 1);
    dial.innerHTML = `
        <span class="dial-needle" style="--needle-angle: ${-135 + rpmPercent * 270}deg"></span>
        <span class="dial-needle-hub"></span>
        <div class="dial-core">
            <strong class="dial-rpm">${engine.rpm.value.toLocaleString()}</strong>
            <span class="dial-unit">${engine.rpm.unit}</span>
        </div>
    `;
    dial.prepend(ticks);
    return dial;
}

function buildSensorRow(sensor) {
    const row = document.createElement('div');
    row.className = 'sensor-row';
    row.dataset.baseValue = sensor.value;
    row.dataset.minValue = sensor.min;
    row.dataset.maxValue = sensor.max;
    row.dataset.unit = sensor.unit;
    const fillPercent = clamp(((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100, 0, 100);
    row.innerHTML = `
        <span class="sensor-label">${sensor.label}</span>
        <div class="sensor-track"><span class="sensor-fill" style="width: ${fillPercent}%"></span></div>
        <strong class="sensor-value">${formatValue(sensor.value)} ${sensor.unit}</strong>
    `;
    return row;
}

function buildEngineCard(engine) {
    const card = document.createElement('article');
    card.className = 'engine-card';
    const statusClass = statusClassMap[engine.status] || 'status-offline';
    card.innerHTML = `
        <header class="panel-header">
            <span class="status-dot ${statusClass}"></span>
            <h2>${engine.name}</h2>
        </header>
        <span class="status-badge ${statusClass}">${engine.status}</span>
    `;

    const content = document.createElement('div');
    content.className = 'engine-content';
    content.appendChild(buildDial(engine));

    const sensorGrid = document.createElement('div');
    sensorGrid.className = 'sensor-grid';
    engine.sensors.forEach(sensor => sensorGrid.appendChild(buildSensorRow(sensor)));
    content.appendChild(sensorGrid);
    card.appendChild(content);
    return card;
}

function updateDial(dial, rpm) {
    const min = Number(dial.dataset.rpmMin);
    const max = Number(dial.dataset.rpmMax);
    const boundedRpm = clamp(rpm, min, max);
    const angle = -135 + ((boundedRpm - min) / (max - min)) * 270;
    dial.querySelector('.dial-needle').style.setProperty('--needle-angle', `${angle}deg`);
    dial.querySelector('.dial-rpm').textContent = Math.round(boundedRpm).toLocaleString();
}

function updateSensor(row, value) {
    const min = Number(row.dataset.minValue);
    const max = Number(row.dataset.maxValue);
    const bounded = clamp(value, min, max);
    row.querySelector('.sensor-fill').style.width = `${clamp(((bounded - min) / (max - min)) * 100, 0, 100)}%`;
    row.querySelector('.sensor-value').textContent = `${formatValue(bounded)} ${row.dataset.unit}`;
}

function startDemo() {
    const cards = Array.from(document.querySelectorAll('.engine-card'));
    function animate(timestamp) {
        const seconds = timestamp / 1000;
        cards.forEach((card, cardIndex) => {
            const rpmAmplitude = engine.status === 'Running' ? 90 : 3;
            updateDial(card.querySelector('.dial'), engine.rpm.value + Math.sin(seconds * 0.45 + cardIndex) * rpmAmplitude);

            card.querySelectorAll('.sensor-row').forEach((row, sensorIndex) => {
                const base = Number(row.dataset.baseValue);
                const range = Number(row.dataset.maxValue) - Number(row.dataset.minValue);
                const amplitude = base === 0 ? range * 0.001 : Math.max(range * 0.0015, base * 0.008);
                updateSensor(row, base + Math.sin(seconds * 0.28 + sensorIndex * 0.55 + cardIndex) * amplitude);
            });
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

dashboard.appendChild(buildEngineCard(engine));
startDemo();