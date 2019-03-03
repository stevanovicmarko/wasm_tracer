(function() {
    var wasm;
    const __exports = {};


    __exports.__wbg_random_c7298a0d4fe46265 = function() {
        return Math.random();
    };

    let cachedTextDecoder = new TextDecoder('utf-8');

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    function getStringFromWasm(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
    }

    __exports.__wbg_log_cc3b7d3a27ec68ff = function(arg0, arg1) {
        let varg0 = getStringFromWasm(arg0, arg1);
        console.log(varg0);
    };

    const heap = new Array(32);

    heap.fill(undefined);

    heap.push(undefined, null, true, false);

    let heap_next = heap.length;

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    __exports.__wbg_static_accessor_crypto_a1e457554975a88e = function() {
        return addHeapObject(crypto);
    };

function getObject(idx) { return heap[idx]; }

let cachegetUint16Memory = null;
function getUint16Memory() {
    if (cachegetUint16Memory === null || cachegetUint16Memory.buffer !== wasm.memory.buffer) {
        cachegetUint16Memory = new Uint16Array(wasm.memory.buffer);
    }
    return cachegetUint16Memory;
}

function getArrayU16FromWasm(ptr, len) {
    return getUint16Memory().subarray(ptr / 2, ptr / 2 + len);
}

let WASM_VECTOR_LEN = 0;

function passArray16ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 2);
    getUint16Memory().set(arg, ptr / 2);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

__exports.__wbg_getRandomValues_1c2d90e9ad87d1c0 = function(ret, arg0, arg1, arg2) {
    let varg1 = getArrayU16FromWasm(arg1, arg2);

    varg1 = varg1.slice();
    wasm.__wbindgen_free(arg1, arg2 * 2);


    const retptr = passArray16ToWasm(getObject(arg0).getRandomValues(varg1));
    const retlen = WASM_VECTOR_LEN;
    const mem = getUint32Memory();
    mem[ret / 4] = retptr;
    mem[ret / 4 + 1] = retlen;

};

function getArrayU32FromWasm(ptr, len) {
    return getUint32Memory().subarray(ptr / 4, ptr / 4 + len);
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}
/**
* @param {number} arg0
* @param {number} arg1
* @param {number} arg2
* @param {boolean} arg3
* @param {boolean} arg4
* @returns {Uint32Array}
*/
__exports.make_image = function(arg0, arg1, arg2, arg3, arg4) {
    const retptr = globalArgumentPtr();
    wasm.make_image(retptr, arg0, arg1, arg2, arg3, arg4);
    const mem = getUint32Memory();
    const rustptr = mem[retptr / 4];
    const rustlen = mem[retptr / 4 + 1];

    const realRet = getArrayU32FromWasm(rustptr, rustlen).slice();
    wasm.__wbindgen_free(rustptr, rustlen * 4);
    return realRet;

};

let cachedTextEncoder = new TextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
}
/**
* @param {string} arg0
* @returns {void}
*/
__exports.greet = function(arg0) {
    const ptr0 = passStringToWasm(arg0);
    const len0 = WASM_VECTOR_LEN;
    try {
        return wasm.greet(ptr0, len0);

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

};

__exports.__wbg_random_fabf73e8a709437c = function() {
    return Math.random();
};

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

__exports.__wbindgen_object_drop_ref = function(i) { dropObject(i); };

function init(path_or_module) {
    let instantiation;
    const imports = { './wasm_tracer': __exports };
    if (path_or_module instanceof WebAssembly.Module) {
        instantiation = WebAssembly.instantiate(path_or_module, imports)
        .then(instance => {
        return { instance, module: path_or_module }
    });
} else {
    const data = fetch(path_or_module);
    if (typeof WebAssembly.instantiateStreaming === 'function') {
        instantiation = WebAssembly.instantiateStreaming(data, imports)
        .catch(e => {
            console.warn("`WebAssembly.instantiateStreaming` failed. Assuming this is because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
            return data
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        });
    } else {
        instantiation = data
        .then(response => response.arrayBuffer())
        .then(buffer => WebAssembly.instantiate(buffer, imports));
    }
}
return instantiation.then(({instance}) => {
    wasm = init.wasm = instance.exports;

});
};
self.wasm_bindgen = Object.assign(init, __exports);
})();
