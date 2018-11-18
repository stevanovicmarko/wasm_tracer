"use strict";
const worker = new Worker('/assets/worker.js');
const renderSettings = document.getElementById('renderSettings');
const widthInput = document.getElementById('canvasWidth');
const heightInput = document.getElementById('canvasHeight');
const raysPerPixel = document.getElementById('raysPerPixel');
const samplesLabel = document.getElementById('samplesLabel');
const radioButtons = document.getElementsByName('scene-select');
const renderButton = document.getElementById('renderButton');
const renderTime = document.getElementById('renderTime');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
raysPerPixel.value = '16';
widthInput.value = '800';
heightInput.value = '500';
samplesLabel.innerHTML = raysPerPixel.value;
raysPerPixel.addEventListener('change', event => {
    samplesLabel.innerHTML = event.target.value;
});
widthInput.addEventListener('change', event => {
    canvas.width = parseInt(event.target.value, 10);
});
heightInput.addEventListener('change', event => {
    canvas.height = parseInt(event.target.value, 10);
});
let sceneType = 'predefined-scene';
let width = canvas.width;
let height = canvas.height;
let numberOfSamples = parseInt(samplesLabel.innerText, 10);
let t0 = 0;
let t1 = 0;
let preventRenderRequests = false;
renderButton.addEventListener('click', event => {
    if (preventRenderRequests) {
        return;
    }
    radioButtons.forEach(radioButton => {
        if (radioButton.checked) {
            sceneType = radioButton.id;
        }
    });
    width = canvas.width;
    height = canvas.height;
    numberOfSamples = parseInt(samplesLabel.innerText, 10);
    const isRandomScene = sceneType !== 'predefined-scene';
    preventRenderRequests = true;
    renderSettings.style.pointerEvents = 'none';
    renderSettings.style.opacity = '0.2';
    renderTime.innerHTML = 'Rendering in progress...';
    t0 = performance.now();
    worker.postMessage({
        width,
        height,
        numberOfSamples,
        isRandomScene,
    });
});
worker.onmessage = ({ data }) => {
    t1 = performance.now();
    const delta = Math.round((t1 - t0) * 1000) / 1000;
    renderTime.innerHTML =
        delta <= 3000
            ? `Render time: ${delta} milliseconds.`
            : `Render time: ${delta / 1000} seconds.`;
    renderSettings.style.pointerEvents = 'auto';
    renderSettings.style.opacity = '1.0';
    preventRenderRequests = false;
    const imageData = new ImageData(new Uint8ClampedArray(data.buffer), width, height);
    ctx.putImageData(imageData, 0, 0);
};
//# sourceMappingURL=main.js.map