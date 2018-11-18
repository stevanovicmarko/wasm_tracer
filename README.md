# wasm-based raytracer

simple raytracer written in rust. Relies on web assembly support. To run do:

````sh
npm (or yarn) install
npm run serve
navigate to localhost:8080
````

To rebuild wasm tracer use rust nightly compiler and run:

````sh
npm build:wasm
````