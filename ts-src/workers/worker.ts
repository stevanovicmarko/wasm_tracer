import { greet, make_image } from './typings/wasm_tracer';

// @ts-ignore
delete WebAssembly.instantiateStreaming;

declare const wasm_bindgen: any;

interface IComEvent extends Event {
  data: {
    width: number;
    height: number;
    isRandomScene: boolean;
    numberOfSamples: number;
  };
}

(async () => {
  self.importScripts('/assets/wasm_tracer.js');

  await wasm_bindgen('/assets/wasm_tracer_bg.wasm');
  const myGreet: typeof greet = (wasm_bindgen as any).greet;
  const myMakeImage: typeof make_image = (wasm_bindgen as any).make_image;

  self.addEventListener('message', event => {
    const {
      width,
      height,
      isRandomScene,
      numberOfSamples,
    } = (event as IComEvent).data;

    const result = myMakeImage(width, height, numberOfSamples, isRandomScene);

    postMessage(result);
  });

  myGreet('wasm works');
})();
