// @ts-ignore
delete WebAssembly.instantiateStreaming;
(async () => {
    self.importScripts('/assets/wasm_tracer.js');
    await wasm_bindgen('/assets/wasm_tracer_bg.wasm');
    const myGreet = wasm_bindgen.greet;
    const myMakeImage = wasm_bindgen.make_image;
    self.addEventListener('message', event => {
        const { width, height, isRandomScene, numberOfSamples, } = event.data;
        const result = myMakeImage(width, height, numberOfSamples, isRandomScene);
        postMessage(result);
    });
    myGreet('wasm works');
})();
//# sourceMappingURL=worker.js.map