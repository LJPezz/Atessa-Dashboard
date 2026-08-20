import engines from './engine-data.js';

const dashboard = document.getElementById('engine-dashboard');
const TAU = Math.PI * 2;

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function formatValue(value) {
    return value < 10 ? value.toFixed(2) : value.toFixed(1);
}

function buildEnginePanel(engine) {
    const panel = document.createElement('article');
    panel.className = 'engine-panel';
    panel.dataset.engineId = engine.id;
    panel.innerHTML = `
        <header class="panel-heading">
            <h2>${engine.name}</h2>
            <span class="running-state"><i></i>${engine.status}</span>
        </header>
        <div class="dial-wrap" data-tag="${engine.tagPrefix}.rpm.value">
            <canvas class="rpm-dial" aria-label="${engine.name}: ${engine.rpm.value} ${engine.rpm.unit}"></canvas>
        </div>
        <div class="sensor-grid"></div>
    `;

    const sensorGrid = panel.querySelector('.sensor-grid');
    engine.sensors.forEach(sensor => {
        const metric = document.createElement('div');
        const percent = clamp((sensor.value - sensor.min) / (sensor.max - sensor.min), 0, 1);
        metric.className = 'sensor';
        metric.dataset.tag = `${engine.tagPrefix}.${sensor.tag}`;
        metric.innerHTML = `
            <span class="sensor-label">${sensor.label}</span>
            <strong>${formatValue(sensor.value)}<small>${sensor.unit}</small></strong>
            <span class="sensor-track"><i style="--sensor-percent: ${percent}"></i></span>
        `;
        sensorGrid.appendChild(metric);
    });
    return panel;
}

function drawDial(canvas, engine, value) {
    const bounds = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.max(1, Math.round(Math.min(bounds.width, bounds.height)));
    const pixels = Math.round(size * pixelRatio);
    if (canvas.width !== pixels || canvas.height !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
    }

    const context = canvas.getContext('2d');
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, size, size);

    const center = size / 2;
    const radius = size * 0.405;
    const bounded = clamp(value, engine.rpm.min, engine.rpm.max);
    const percent = (bounded - engine.rpm.min) / (engine.rpm.max - engine.rpm.min);
    const startAngle = Math.PI * 0.75;
    const sweepAngle = Math.PI * 1.5;
    const endAngle = startAngle + percent * sweepAngle;

    const face = context.createRadialGradient(center * 0.82, center * 0.72, size * 0.04, center, center, radius * 1.15);
    face.addColorStop(0, '#32383d');
    face.addColorStop(0.55, '#1b2025');
    face.addColorStop(1, '#080b0e');
    context.beginPath();
    context.arc(center, center, radius * 1.14, 0, TAU);
    context.fillStyle = '#2f3333';
    context.fill();
    context.lineWidth = size * 0.025;
    context.strokeStyle = '#4a4e4d';
    context.stroke();

    context.beginPath();
    context.arc(center, center, radius, 0, TAU);
    context.fillStyle = face;
    context.fill();
    context.lineWidth = size * 0.035;
    context.strokeStyle = '#071018';
    context.stroke();

    context.save();
    context.shadowColor = '#00d5f2';
    context.shadowBlur = size * 0.045;
    context.lineWidth = size * 0.028;
    context.lineCap = 'round';
    context.strokeStyle = '#00c8e6';
    context.beginPath();
    context.arc(center, center, radius * 0.9, startAngle, startAngle + sweepAngle);
    context.strokeStyle = '#19323b';
    context.stroke();
    context.beginPath();
    context.arc(center, center, radius * 0.9, startAngle, endAngle);
    context.strokeStyle = '#00c8e6';
    context.stroke();
    context.restore();

    for (let index = 0; index <= 25; index += 1) {
        const angle = startAngle + (index / 25) * sweepAngle;
        const isMajor = index % 5 === 0;
        const outer = radius * 0.86;
        const inner = radius * (isMajor ? 0.77 : 0.81);
        context.beginPath();
        context.moveTo(center + Math.cos(angle) * inner, center + Math.sin(angle) * inner);
        context.lineTo(center + Math.cos(angle) * outer, center + Math.sin(angle) * outer);
        context.lineWidth = isMajor ? 2 : 1;
        context.strokeStyle = isMajor ? '#657077' : '#3c484f';
        context.stroke();
    }

    const needleLength = radius * 0.7;
    const needleWidth = size * 0.028;
    context.save();
    context.translate(center, center);
    context.rotate(endAngle + Math.PI / 2);
    const needleGradient = context.createLinearGradient(0, 0, 0, -needleLength);
    needleGradient.addColorStop(0, '#707980');
    needleGradient.addColorStop(1, '#dce6eb');
    context.beginPath();
    context.moveTo(-needleWidth, size * 0.025);
    context.lineTo(0, -needleLength);
    context.lineTo(needleWidth, size * 0.025);
    context.closePath();
    context.fillStyle = needleGradient;
    context.shadowColor = '#000';
    context.shadowBlur = 5;
    context.fill();
    context.restore();

    context.fillStyle = '#798086';
    context.font = `600 ${Math.round(size * 0.048)}px "Arial Narrow", sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let index = 0; index <= 5; index += 1) {
        const angle = startAngle + (index / 5) * sweepAngle;
        const labelRadius = radius * 0.57;
        context.fillText(
            Math.round(engine.rpm.max / 5 * index).toLocaleString(),
            center + Math.cos(angle) * labelRadius,
            center + Math.sin(angle) * labelRadius
        );
    }

    context.fillStyle = '#00c8e6';
    context.font = `700 ${Math.round(size * 0.105)}px "Arial Narrow", sans-serif`;
    context.shadowColor = '#071014';
    context.shadowBlur = 5;
    context.fillText(Math.round(bounded).toLocaleString(), center, center + radius * 0.74);
    context.fillStyle = '#8c9397';
    context.font = `700 ${Math.round(size * 0.045)}px "Arial Narrow", sans-serif`;
    context.fillText(engine.rpm.unit, center, center + radius * 0.92);
    context.shadowBlur = 0;
}

engines.forEach(engine => dashboard.appendChild(buildEnginePanel(engine)));

const panels = Array.from(document.querySelectorAll('.engine-panel'));
function animate(timestamp) {
    const seconds = timestamp / 1000;
    panels.forEach((panel, index) => {
        const engine = engines[index];
        const value = engine.rpm.value + Math.sin(seconds * 0.42 + index) * 18;
        drawDial(panel.querySelector('.rpm-dial'), engine, value);
    });
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);