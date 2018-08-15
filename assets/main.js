"use strict";
const wasmPromise = import('./wasm_tracer');
wasmPromise
    .then(({ make_image, greet }) => {
    greet('ABC');
    const widthInput = document.getElementById("canvasWidth");
    const heighInput = document.getElementById("canvasHeight");
    const raysPerPixel = document.getElementById("raysPerPixel");
    const samplesLabel = document.getElementById("samplesLabel");
    const renderButton = document.getElementById("renderButton");
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    raysPerPixel.addEventListener("change", event => {
        samplesLabel.innerHTML = event.target.value;
    });
    widthInput.addEventListener("change", event => {
        canvas.width = parseInt(event.target.value, 10);
    });
    heighInput.addEventListener("change", event => {
        canvas.height = parseInt(event.target.value, 10);
    });
    let timeoutHandler = null;
    renderButton.addEventListener("click", event => {
        const width = canvas.width;
        const height = canvas.height;
        const numberOfSamples = parseInt(samplesLabel.innerText, 10);
        renderButton.disabled = true;
        renderButton.innerText = "Rendering...";
        if (!timeoutHandler) {
            timeoutHandler = setTimeout(() => {
                if (renderButton.disabled) {
                    const pixels = make_image(width, height, numberOfSamples);
                    const imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
                    ctx.putImageData(imageData, 0, 0);
                    renderButton.innerText = "Render";
                    renderButton.disabled = false;
                    timeoutHandler = null;
                }
            }, 100);
        }
    });
})
    .catch(e => console.error(e));