"use strict";
const wasmPromise = import('./wasm_tracer');
wasmPromise
    .then(({ make_image, greet }) => {
    greet('ABC');
    const widthInput = document.getElementById("canvasWidth");
    const heightInput = document.getElementById("canvasHeight");
    const raysPerPixel = document.getElementById("raysPerPixel");
    const samplesLabel = document.getElementById("samplesLabel");
    const radioButtons = document.getElementsByName("scene-select");
    const renderButton = document.getElementById("renderButton");
    const renderTime = document.getElementById("renderTime");
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    raysPerPixel.value = "16";
    widthInput.value = "800";
    heightInput.value = "500";
    samplesLabel.innerHTML = raysPerPixel.value;
    raysPerPixel.addEventListener("change", event => {
        samplesLabel.innerHTML = event.target.value;
    });
    widthInput.addEventListener("change", event => {
        canvas.width = parseInt(event.target.value, 10);
    });
    heightInput.addEventListener("change", event => {
        canvas.height = parseInt(event.target.value, 10);
    });
    let timeoutHandler = null;
    let sceneType = "predefined-scene";
    renderButton.addEventListener("click", event => {
        radioButtons.forEach(radioButton => {
            if (radioButton.checked) {
                sceneType = radioButton.id;
            }
        });
        const randomScene = sceneType !== "predefined-scene";
        const width = canvas.width;
        const height = canvas.height;
        const numberOfSamples = parseInt(samplesLabel.innerText, 10);
        raysPerPixel.disabled = true;
        widthInput.disabled = true;
        heightInput.disabled = true;
        renderButton.disabled = true;
        renderButton.innerText = "Rendering...";
        renderTime.innerHTML = "";
        if (!timeoutHandler) {
            timeoutHandler = setTimeout(() => {
                if (renderButton.disabled) {
                    const t0 = performance.now();
                    const pixels = make_image(width, height, numberOfSamples, randomScene);
                    const imageData = new ImageData(new Uint8ClampedArray(pixels.buffer), width, height);
                    ctx.putImageData(imageData, 0, 0);
                    const t1 = performance.now();
                    let delta = t1 - t0;
                    if (delta <= 2000) {
                        renderTime.innerHTML = `Render time: ${delta} milliseconds.`;
                    }
                    else {
                        renderTime.innerHTML = `Render time: ${delta / 1000} seconds.`;
                    }
                    renderButton.innerText = "Render";
                    raysPerPixel.disabled = false;
                    widthInput.disabled = false;
                    heightInput.disabled = false;
                    renderButton.disabled = false;
                    timeoutHandler = null;
                }
            }, 100);
        }
    });
})
    .catch(e => console.error(e));
