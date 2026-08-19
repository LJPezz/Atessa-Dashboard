// This file contains the main JavaScript code for the generator icons application.

import iconsData from './icons-data.js';

const iconContainer = document.getElementById('icon-container');

const statusClassMap = {
    Running: 'status-running',
    Standby: 'status-standby',
    Maintenance: 'status-maintenance',
    Offline: 'status-offline'
};

// gauges shown as bar rows below the big dial, in display order
const gaugeFields = [
    ['temperature', 'Temperature'],
    ['coolant', 'Coolant'],
    ['lubeOil', 'Lube Oil']
];

function buildDial(generator) {
    const dial = document.createElement('div');
    dial.classList.add('dial', statusClassMap[generator.status] || 'status-offline');
    dial.dataset.rpmMin = generator.rpm.min;
    dial.dataset.rpmMax = generator.rpm.max;
    dial.dataset.status = generator.status;

    const ticks = document.createElement('div');
    ticks.classList.add('dial-ticks');

    const tickCount = 30;
    for (let index = 0; index <= tickCount; index += 1) {
        const tick = document.createElement('span');
        tick.classList.add('dial-tick');
        if (index % 5 === 0) {
            tick.classList.add('dial-tick-major');
        }
        tick.style.setProperty('--tick-angle', `${-135 + (index / tickCount) * 270}deg`);
        ticks.appendChild(tick);
    }

    for (let index = 0; index <= 6; index += 1) {
        const label = document.createElement('span');
        label.classList.add('dial-mark-label');
        label.textContent = (generator.rpm.max / 6 * index).toLocaleString();
        label.style.setProperty('--mark-angle', `${-135 + (index / 6) * 270}deg`);
        ticks.appendChild(label);
    }

    const rpmPercent = Math.min(1, Math.max(0, (generator.rpm.value - generator.rpm.min) / (generator.rpm.max - generator.rpm.min)));
    const needle = document.createElement('span');
    needle.classList.add('dial-needle');
    needle.style.setProperty('--needle-angle', `${-135 + rpmPercent * 270}deg`);

    const needleHub = document.createElement('span');
    needleHub.classList.add('dial-needle-hub');

    const dialCore = document.createElement('div');
    dialCore.classList.add('dial-core');

    const rpmValue = document.createElement('span');
    rpmValue.classList.add('dial-rpm');
    rpmValue.textContent = generator.rpm.value.toLocaleString();

    const rpmUnit = document.createElement('span');
    rpmUnit.classList.add('dial-rpm-unit');
    rpmUnit.textContent = generator.rpm.unit;

    const voltage = document.createElement('span');
    voltage.classList.add('dial-voltage');
    voltage.textContent = generator.voltage.value.toFixed(2);

    const voltageUnit = document.createElement('span');
    voltageUnit.classList.add('dial-voltage-unit');
    voltageUnit.textContent = generator.voltage.unit;

    dialCore.appendChild(rpmValue);
    dialCore.appendChild(rpmUnit);
    dialCore.appendChild(voltage);
    dialCore.appendChild(voltageUnit);
    dial.appendChild(ticks);
    dial.appendChild(needle);
    dial.appendChild(needleHub);
    dial.appendChild(dialCore);
    return dial;
}

function updateDial(dial, rpm) {
    const rpmMin = Number(dial.dataset.rpmMin);
    const rpmMax = Number(dial.dataset.rpmMax);
    const rpmPercent = Math.min(1, Math.max(0, (rpm - rpmMin) / (rpmMax - rpmMin)));
    const needleAngle = -135 + rpmPercent * 270;

    dial.querySelector('.dial-needle').style.setProperty('--needle-angle', `${needleAngle}deg`);
    dial.querySelector('.dial-rpm').textContent = Math.round(rpm).toLocaleString();
}

function startDemo() {
    const runningDials = Array.from(document.querySelectorAll('.dial[data-status="Running"]'));
    const cards = Array.from(document.querySelectorAll('.icon-card'));
    const gaugeMotion = {
        temperature: { amplitude: 35, speed: 0.22 },
        coolant: { amplitude: 4, speed: 0.28 },
        lubeOil: { amplitude: 3, speed: 0.34 }
    };

    function animate(timestamp) {
        const seconds = timestamp / 1000;
        runningDials.forEach((dial, index) => {
            const rpm = 1800 + Math.sin(seconds * 0.8 + index * 1.4) * 750;
            updateDial(dial, rpm);
        });

        cards.forEach((card, cardIndex) => {
            const isRunning = card.querySelector('.dial').dataset.status === 'Running';
            card.querySelectorAll('.gauge-row').forEach((row, gaugeIndex) => {
                const motion = gaugeMotion[row.dataset.gaugeKey];
                const amplitude = motion.amplitude * (isRunning ? 1 : 0.25);
                const phase = cardIndex * 1.7 + gaugeIndex * 0.9;
                const value = Number(row.dataset.baseValue) + Math.sin(seconds * motion.speed + phase) * amplitude;
                updateGauge(row, value);
            });
        });
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

function buildGaugeRow(key, label, gauge) {
    const row = document.createElement('div');
    row.classList.add('gauge-row');
    row.dataset.gaugeKey = key;
    row.dataset.baseValue = gauge.value;
    row.dataset.minValue = gauge.min;
    row.dataset.maxValue = gauge.max;
    row.dataset.unit = gauge.unit;

    const rowLabel = document.createElement('span');
    rowLabel.classList.add('gauge-label');
    rowLabel.textContent = label;

    const track = document.createElement('div');
    track.classList.add('gauge-track');

    const fill = document.createElement('div');
    fill.classList.add('gauge-fill');
    const percent = Math.min(100, Math.max(0, ((gauge.value - gauge.min) / (gauge.max - gauge.min)) * 100));
    fill.style.width = `${percent}%`;
    track.appendChild(fill);

    const rowValue = document.createElement('span');
    rowValue.classList.add('gauge-value');
    rowValue.textContent = `${gauge.value.toFixed(2)} ${gauge.unit}`;

    row.appendChild(rowLabel);
    row.appendChild(track);
    row.appendChild(rowValue);
    return row;
}

function updateGauge(row, value) {
    const minValue = Number(row.dataset.minValue);
    const maxValue = Number(row.dataset.maxValue);
    const percent = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));

    row.querySelector('.gauge-fill').style.width = `${percent}%`;
    row.querySelector('.gauge-value').textContent = `${value.toFixed(2)} ${row.dataset.unit}`;
}

function displayIcons() {
    iconsData.forEach(generator => {
        const iconCard = document.createElement('div');
        iconCard.classList.add('icon-card');

        const header = document.createElement('div');
        header.classList.add('panel-header');

        const statusDot = document.createElement('span');
        statusDot.classList.add('status-dot', statusClassMap[generator.status] || 'status-offline');

        const iconName = document.createElement('h3');
        iconName.textContent = generator.name;

        header.appendChild(statusDot);
        header.appendChild(iconName);

        const statusBadge = document.createElement('span');
        statusBadge.classList.add('status-badge', statusClassMap[generator.status] || 'status-offline');
        statusBadge.textContent = generator.status;

        const dialWrap = document.createElement('div');
        dialWrap.classList.add('dial-wrap');
        dialWrap.appendChild(buildDial(generator));

        const gauges = document.createElement('div');
        gauges.classList.add('gauge-list');
        gaugeFields.forEach(([key, label]) => {
            gauges.appendChild(buildGaugeRow(key, label, generator[key]));
        });

        iconCard.appendChild(header);
        iconCard.appendChild(statusBadge);
        iconCard.appendChild(dialWrap);
        iconCard.appendChild(gauges);
        iconContainer.appendChild(iconCard);
    });

    startDemo();
}

document.addEventListener('DOMContentLoaded', displayIcons);