import engines from './engine-data.js';

const dashboard = document.getElementById('engine-dashboard');

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function formatValue(value) {
    return value < 10 && value !== 0 ? value.toFixed(2) : value.toFixed(1);
}

function buildRpmGauge(engine) {
    const percent = clamp((engine.rpm.value - engine.rpm.min) / (engine.rpm.max - engine.rpm.min), 0, 1);
    const gauge = document.createElement('div');
    gauge.className = 'rpm-gauge';
    gauge.dataset.rpmMin = engine.rpm.min;
    gauge.dataset.rpmMax = engine.rpm.max;
    gauge.dataset.tag = `${engine.tagPrefix}.rpm.value`;
    gauge.style.setProperty('--rpm-percent', percent);
    gauge.innerHTML = `
        <div class="rpm-ring">
            <div class="rpm-readout"><strong>${Math.round(engine.rpm.value)}</strong><span>${engine.rpm.unit}</span></div>
        </div>
        <div class="rpm-scale"><span>0</span><span>${engine.rpm.max.toLocaleString()}</span></div>
        <span class="load-label">ENGINE SPEED</span>
    `;
    return gauge;
}

function buildMetric(sensor, tagPrefix) {
    const metric = document.createElement('div');
    const percent = clamp((sensor.value - sensor.min) / (sensor.max - sensor.min), 0, 1);
    metric.className = 'metric';
    metric.dataset.baseValue = sensor.value;
    metric.dataset.minValue = sensor.min;
    metric.dataset.maxValue = sensor.max;
    metric.dataset.unit = sensor.unit;
    metric.dataset.tag = `${tagPrefix}.${sensor.tag}`;
    metric.title = sensor.label;
    metric.innerHTML = `
        <div class="metric-heading"><span>${sensor.shortLabel}</span><i>Normal</i></div>
        <div class="metric-body">
            <div class="metric-scale">
                <span>${sensor.max}</span>
                <div class="metric-track"><span class="metric-fill" style="height: ${percent * 100}%"></span></div>
                <span>${sensor.min}</span>
            </div>
            <div class="metric-value"><strong>${formatValue(sensor.value)}</strong><span>${sensor.unit}</span></div>
        </div>
    `;
    return metric;
}

function buildEnginePanel(engine) {
    const panel = document.createElement('article');
    panel.className = `engine-panel engine-${engine.id}`;
    panel.innerHTML = `
        <header class="engine-header">
            <div><span class="engine-index">${engine.id === 'port' ? '01' : '02'}</span><h2>${engine.name}</h2></div>
            <span class="state"><i></i>${engine.status}</span>
        </header>
    `;

    const content = document.createElement('div');
    content.className = 'engine-content';
    content.appendChild(buildRpmGauge(engine));

    const metrics = document.createElement('div');
    metrics.className = 'metrics-grid';
    engine.sensors.forEach(sensor => metrics.appendChild(buildMetric(sensor, engine.tagPrefix)));
    content.appendChild(metrics);
    panel.appendChild(content);
    return panel;
}

function updateGauge(gauge, rpm) {
    const min = Number(gauge.dataset.rpmMin);
    const max = Number(gauge.dataset.rpmMax);
    const bounded = clamp(rpm, min, max);
    gauge.style.setProperty('--rpm-percent', (bounded - min) / (max - min));
    gauge.querySelector('.rpm-readout strong').textContent = Math.round(bounded).toLocaleString();
}

function updateMetric(metric, value) {
    const min = Number(metric.dataset.minValue);
    const max = Number(metric.dataset.maxValue);
    const bounded = clamp(value, min, max);
    metric.querySelector('.metric-fill').style.height = `${((bounded - min) / (max - min)) * 100}%`;
    metric.querySelector('.metric-value strong').textContent = formatValue(bounded);
}

function startDemo() {
    const panels = Array.from(document.querySelectorAll('.engine-panel'));
    function animate(timestamp) {
        const seconds = timestamp / 1000;
        panels.forEach((panel, panelIndex) => {
            const engine = engines[panelIndex];
            updateGauge(panel.querySelector('.rpm-gauge'), engine.rpm.value + Math.sin(seconds * 0.45 + panelIndex) * 3);
            panel.querySelectorAll('.metric').forEach((metric, metricIndex) => {
                const base = Number(metric.dataset.baseValue);
                const range = Number(metric.dataset.maxValue) - Number(metric.dataset.minValue);
                updateMetric(metric, base + Math.sin(seconds * 0.3 + metricIndex * 0.7 + panelIndex) * Math.max(range * 0.0015, base * 0.008));
            });
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

engines.forEach(engine => dashboard.appendChild(buildEnginePanel(engine)));
startDemo();