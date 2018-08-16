const wasmPromise = import('./wasm_tracer');

wasmPromise
    .then(({make_image, greet}) => {
        greet('ABC');
        const widthInput = document.getElementById("canvasWidth") as HTMLInputElement;
        const heightInput = document.getElementById("canvasHeight") as HTMLInputElement;
        const raysPerPixel = document.getElementById("raysPerPixel") as HTMLInputElement;
        const samplesLabel = document.getElementById("samplesLabel") as HTMLSpanElement;
        const renderButton = document.getElementById("renderButton") as HTMLButtonElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        raysPerPixel.value = "16";
        widthInput.value = "800";
        heightInput.value = "500";

        samplesLabel.innerHTML = raysPerPixel.value;

        raysPerPixel.addEventListener("change", event => {
            samplesLabel.innerHTML = (event.target as HTMLInputElement).value;
        });

        widthInput.addEventListener("change", event => {
            canvas.width = parseInt((event.target as HTMLInputElement).value, 10);
        });

        heightInput.addEventListener("change", event => {
            canvas.height = parseInt((event.target as HTMLInputElement).value, 10);
        });

        let timeoutHandler = null as (null | number);

        renderButton.addEventListener("click", event => {
            const width = canvas.width;
            const height = canvas.height;
            const numberOfSamples = parseInt(samplesLabel.innerText, 10);


            renderButton.disabled = true;
            widthInput.disabled = true;
            heightInput.disabled = true;

            renderButton.innerText = "Rendering...";

            if (!timeoutHandler) {
                timeoutHandler = setTimeout(() => {
                    if (renderButton.disabled) {
                        const pixels = make_image(width, height, numberOfSamples);
                        const imageData = new ImageData(
                            new Uint8ClampedArray(pixels.buffer),
                            width,
                            height
                        );
                        ctx.putImageData(imageData, 0, 0);
                        renderButton.innerText = "Render"
                        renderButton.disabled = false;
                        widthInput.disabled = false;
                        heightInput.disabled = false;
                        timeoutHandler = null;
                    }
                }, 100);
            }
        });
    })
    .catch(e => console.error(e));
