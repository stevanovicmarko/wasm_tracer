const wasmPromise = import('./wasm_tracer');

wasmPromise
  .then(({ make_image, greet }) => {
    greet('ABC');
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const width = canvas.width;
    const height = canvas.height;

    const pixels = make_image(width, height);
    const imageData = new ImageData(
      new Uint8ClampedArray(pixels.buffer),
      width,
      height
    );

    ctx.putImageData(imageData, 0, 0);
  })
  .catch(e => console.error(e));
